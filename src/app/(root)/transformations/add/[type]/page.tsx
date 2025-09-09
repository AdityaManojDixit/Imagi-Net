import { auth } from "@clerk/nextjs/server";
import React, { useEffect, useState } from 'react';
import Header from '@/components/ui/shared/Header';
import { transformationTypes } from '@/constants';
import { useAuth } from '@clerk/clerk-react';
import { getUserById } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import { UUser } from '@/lib/db/models/user.model';
import TransForm from '@/components/ui/shared/TransForm';


const AddTransformationTypePage = async ({ params: { type } }: SearchParamProps) => {
  const { userId } = auth();
  const transformation = transformationTypes[type];

  if(!userId) redirect('/sign-in')

  const user = await getUserById(userId);

  return (
    <>
      <Header 
        title={transformation.title}
        subtitle={transformation.subTitle}
      />
    
      <section className="mt-10">
        <TransForm 
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  )
}

export default AddTransformationTypePage