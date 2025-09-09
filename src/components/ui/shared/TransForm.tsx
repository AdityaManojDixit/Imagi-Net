"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  aspectRatioOptions,
  creditFee,
  defaultValues,
  transformationTypes,
} from "@/constants";
import { CustomField } from "./CustomField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState, useTransition, useCallback } from "react";
import TransformedImage from "@/components/ui/shared/TransfromedImage";
import { AspectRatioKey, deepMergeObjects } from "@/lib/utils";
import MediaUploader from "./MediaUploader";
import { InsufficientCreditsModal } from "./InsufficientCreditsModal";
import { updateCredits } from "@/lib/actions/user.actions";
import { getCldImageUrl } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { addImage, updateImage } from "@/lib/actions/image.actions";

export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(), // keeps your existing field name
  prompt: z.string().optional(),
  publicId: z.string().optional(),
});

const TransForm = ({
  action,
  data = null,
  userId,
  type,
  creditBalance,
  config = null,
}: TransformationFormProps) => {
  const transformationType = transformationTypes[type];
  const [image, setImage] = useState(data);
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(config);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const initialValues =
    data && action === "Update"
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : defaultValues;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // ---------- onSubmit (save) ----------
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    if (data || image) {
      const transformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig,
      });

      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        transformationType: type,
        width: image?.width,
        height: image?.height,
        config: transformationConfig,
        secureUrl: image?.secureUrl,
        transformationURL: transformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,
      };

      if (action === "Add") {
        try {
          const newImage = await addImage({
            image: imageData,
            userId,
            path: "/",
          });

          if (newImage) {
            form.reset();
            setImage(data);
            router.push(`/transformations/${newImage._id}`);
          }
        } catch (error) {
          console.log("addImage error:", error);
        }
      }

      if (action === "Update") {
        try {
          const updatedImage = await updateImage({
            image: {
              ...imageData,
              _id: data._id,
            },
            userId,
            path: `/transformations/${data._id}`,
          });

          if (updatedImage) {
            router.push(`/transformations/${updatedImage._id}`);
          }
        } catch (error) {
          console.log("updateImage error:", error);
        }
      }
    }

    setIsSubmitting(false);
  }

  // ---------- select handler ----------
  const onSelectFieldHandler = (value: string, onChangefield: (value: string) => void) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey];
    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }));

    // initialize transformation config when user selects aspect ratio
    setNewTransformation(transformationType.config);
    return onChangefield(value);
  };

  // ---------- stable debounce implementation ----------
  const debounceTimer = useRef<number | null>(null);

  // Clear timer helper
  const clearDebounceTimer = () => {
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
  };

  // debounced updater (stable reference)
  const debouncedUpdate = useCallback((fieldName: string, value: string, t: string, delay = 800) => {
    clearDebounceTimer();
    // set timer
    debounceTimer.current = window.setTimeout(() => {
      setNewTransformation((prevState: any) => {
        // map UI field 'color' to config key 'to' for recolor
        const configKey = t === "recolor" && fieldName === "color" ? "to" : fieldName;

        const updated = {
          ...prevState,
          [t]: {
            ...prevState?.[t],
            [configKey]: value,
          },
        };
        console.log("🆕 New Transformation state (debounced):", updated);
        return updated;
      });
      debounceTimer.current = null;
    }, delay);
  }, []);

  // clean up on unmount
  useEffect(() => {
    return () => {
      clearDebounceTimer();
    };
  }, []);

  // ---------- input change handler ----------
  function onInputChangeHandler(
    fieldName: string,
    value: string,
    t: string,
    onChangeField: (value: string) => void
  ): void {
    // always update form control immediately so input remains editable
    console.log("📩 Input changed:", fieldName, value, t);
    onChangeField(value);

    // ensure we have a base newTransformation object to merge into
    if (!newTransformation) {
      // initialize with defaults from transformation type config if available
      setNewTransformation(transformationType.config ?? { [t]: {} });
      // schedule the actual value update after small tick - we still call debouncedUpdate so it'll set later
    }

    // call debounced update (maps color->to for recolor)
    debouncedUpdate(fieldName, value, t);
  }

  // ---------- apply transformation ----------
  const onTransformHandler = async () => {
    console.log("✅ Apply Transformation button clicked, newTransformation:", newTransformation);
    if (!newTransformation) {
      console.warn("No transformation present. Please fill inputs or select options first.");
      return;
    }

    setIsTransforming(true);

    // merge newTransformation into transformationConfig (preserve existing config)
    setTransformationConfig((prev) => deepMergeObjects(newTransformation, prev));

    // clear staged transformation
    setNewTransformation(null);

    startTransition(async () => {
      try {
        //optional credit update if needed (commented out earlier)
        await updateCredits(userId, creditFee);
      } catch (err) {
        console.log("updateCredits error:", err);
      } finally {
        // unset transforming after a short delay to allow TransformedImage to react
        setTimeout(() => setIsTransforming(false), 300);
      }
    });
  };

  // auto-init some transformations based on image/type
  useEffect(() => {
    if (image && (type === "restore" || type === "removeBackground")) {
      setNewTransformation(transformationType.config);
    }
  }, [image, transformationType.config, type]);

  // ---------- render ----------
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}

        <CustomField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full"
          render={({ field }) => <Input {...field} className="input-field" />}
        />

        {type === "fill" && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect Ratio"
            className="w-full"
            render={({ field }) => (
              <Select
                onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                value={field.value}
              >
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key} className="select-item">
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {(type === "remove" || type === "recolor") && (
          <div className="prompt-field">
            <CustomField
              control={form.control}
              name="prompt"
              formLabel={type === "remove" ? "Object to remove" : "Object to recolor"}
              className="w-full"
              render={({ field }) => (
                <Input
                  {...field}
                  className="input-field"
                  onChange={(e) =>
                    onInputChangeHandler("prompt", e.target.value, type, field.onChange)
                  }
                />
              )}
            />

            {type === "recolor" && (
              <CustomField
                control={form.control}
                name="color"
                formLabel="Replacement Color"
                className="w-full"
                render={({ field }) => (
                  <Input
                    {...field}
                    className="input-field"
                    onChange={(e) =>
                      onInputChangeHandler("color", e.target.value, "recolor", field.onChange)
                    }
                  />
                )}
              />
            )}
          </div>
        )}

        <div className="media-uploader-field">
          <CustomField
            control={form.control}
            name="publicId"
            className="flex size-full flex-col"
            render={({ field }) => (
              <MediaUploader
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}
              />
            )}
          />

          <TransformedImage
            image={image}
            type={type}
            title={form.getValues().title}
            isTransforming={isTransforming}
            setIsTransforming={setIsTransforming}
            transformationConfig={transformationConfig}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="button"
            disabled={isTransforming || newTransformation === null}
            onClick={onTransformHandler}
            className="submit-button capitalize"
          >
            {isTransforming ? "Transforming.." : "Apply Transformation"}
          </Button>

          <Button type="submit" disabled={isSubmitting} className="submit-button capitalize">
            {isSubmitting ? "Submitting..." : "Save Image"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransForm;
