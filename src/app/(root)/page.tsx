// Homepage.tsx
import { auth } from "@clerk/nextjs/server";
import { Collection } from "@/components/ui/shared/Collection";
import { navLinks } from "@/constants";
import { getUserImages } from "@/lib/actions/image.actions";
import { getUserById } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || "";

  // get logged-in user
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  // fetch the actual MongoDB user doc
  const user = await getUserById(userId);
  if (!user) redirect("/sign-in");

  // fetch only this user’s images (using ObjectId + search query)
  const images = await getUserImages({
    page,
    userId: user._id.toString(),
    searchQuery, // ✅ added
  });

  return (
    <>
      <section className="home">
        <h1 className="home-heading">
          Unleash Your Creative Vision withImagiNET
        </h1>
        <ul className="flex-center w-full gap-20">
          {navLinks.slice(1, 5).map((link) => (
            <Link
              key={link.route}
              href={link.route}
              className="flex-center flex-col gap-2"
            >
              <li className="flex-center w-fit rounded-full bg-white p-4">
                <Image src={link.icon} alt="image" width={24} height={24} />
              </li>
              <p className="p-14-medium text-center text-white">
                {link.label}
              </p>
            </Link>
          ))}
        </ul>
      </section>

      <section className="sm:mt-12">
        <Collection
          hasSearch={true}
          images={images?.data || []}
          totalPages={images?.totalPages || 1}
          page={page}
        />
      </section>
    </>
  );
};

export default Home;
