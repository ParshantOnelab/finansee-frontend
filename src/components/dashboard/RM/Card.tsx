
function Card({ title, value, img }: { title: string, value: number | string, img?: string }) {
    return (
        <div className='p-3 sm:p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col gap-3 sm:gap-5 font-bold dark:text-gray-300'>
            <div className='flex items-center gap-2 sm:gap-2'>
                <img src={img} alt={title} className='w-8 h-8 sm:w-10 sm:h-10' />
                <h1 className='text-base sm:text-lg md:text-xl'>{title}</h1>
            </div>
            <p className='text-2xl sm:text-2xl md:text-4xl lg:text-6xl'>
                {value}
                {
                    title === "Avg. Login Gap" && <span className='text-xs sm:text-base md:text-lg font-normal'> /days</span>
                }
            </p>
        </div>
    )
}

export default Card
