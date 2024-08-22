import IndividualIdea from '@/components/IndividualIdea'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'
import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
interface PageProps {
  params: {
    ideaId: string
  }
}
const Page = async({ params }: PageProps) => {
  const { ideaId } = params

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
      <IndividualIdea ideaId={ideaId}/>
    </MaxWidthWrapper>
  )
}

export default Page