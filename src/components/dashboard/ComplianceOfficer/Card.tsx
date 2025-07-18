
export default function Card({ title, value, img }: { title: string; value: number | string; img: string }) {
  return (
    <div className='p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col gap-6 font-bold dark:text-gray-300'>
            <div className='flex items-center gap-2'>
                <img src={img} alt={title} className='w-12 h-12' />
                <h1 className='text-xl'>{title}</h1>
            </div>
            <p className='text-xl md:text-3xl lg:text-8xl'>
                {value}
                 <span className='text-2xl font-bold'> %</span>
                
            </p>
        </div>
  )
}
