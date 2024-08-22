import IdeaBrowsingDashboard, { Idea } from '@/components/IdeaBrowsingDashboard'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import React from 'react'
import { db } from '@/db'
import { redirect } from 'next/navigation'
interface Props {}


const Page = async() => {

  const { getUser } = getKindeServerSession()

  const user = await getUser()
  if(!user || !user.id) redirect("/auth-callback?origin=dashboard")

  const dbUser = await db.user.findFirst({
    where: {id : user.id}
  })
  
  if(!dbUser){
    redirect("/auth-callback?origin=dashboard")
  }

  return (
    <MaxWidthWrapper>
      <IdeaBrowsingDashboard/>
    </MaxWidthWrapper>
  )
}

export default Page