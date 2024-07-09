import Card from '@/components/Card'
import React from 'react'

const page = () => {
    return (
        <div className='w-full'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {CardData.map((item, idx) => {
                    return (
                        <Card key={idx} title={item.title} desc={item.desc} link={item.link} btn={item.btn} />
                    )
                })}

            </div>

        </div>
    )
}

export default page


const CardData = [
    {
        title: "Dashboard",
        desc: "This is the dashboard",
        link: "/user/dashboard",
        btn: "View Dashboard"
    },
    {
        title: "Quiz",
        desc: "This is the quiz",
        link: "/user/quiz",
        btn: "View Quiz"
    }
]