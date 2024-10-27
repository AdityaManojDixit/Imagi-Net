'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/ui/shared/Header';
import { transformationTypes } from '@/constants';
import TransformationForm from '@/components/ui/shared/TransformationForm';
import { useAuth } from '@clerk/clerk-react';
import { getUserById } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import { UUser } from '@/lib/db/models/user.model';
import TransForm from '@/components/ui/shared/TransForm';
 
const AddTransformationTypePage = ({ params: { type } }: SearchParamProps) => {
  const { userId } = useAuth();
  const [user, setUser] = useState<UUser | null>(null);
  const transformation = transformationTypes[type];


  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        redirect('/sign-in');
      }

      try {
        const userData = await getUserById(userId);
        if (userData) {
          setUser(userData);
        }

      } catch (error) {
        console.error('Error fetching user:', error);
      } 
    };

    fetchUser();
  }, [userId]);


  return (
    <>
      <Header 
        title={transformation.title}
        subtitle={transformation.subTitle}
      />
    
      <section className='mt-10' >
        <TransForm 
          action="Add"
          userId={user? user._id : ""}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user? user.creditBalance : 0}
        />
      </section>
    </>
  );
}

export default AddTransformationTypePage;
