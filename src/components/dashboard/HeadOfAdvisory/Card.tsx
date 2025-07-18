

function Card({ title, value, img }: { title: string, value: number | string, img?: string }) {
    return (
        <div className='p-4 py-10 bg-white dark:bg-gray-800 shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 flex justify-between gap-6 font-bold dark:text-gray-300'>
            <div className='flex items-center gap-2 '>
                <img src={img} alt={title} className='w-12 h-12' />
                <h1 className='text-lg lg:text-xl whitespace-pre-line'>{title}</h1>
            </div>
            <div className='flex flex-1 items-center justify-center'>
                <p className='text-xl md:text-2xl lg:text-4xl text-center align-middle font-bold text-gray-800 dark:text-gray-200'>
                    {value}
                    {
                        title === "Active Biases" && <span className='text-lg font-normal'> /days</span>
                    }
                </p>
            </div>
        </div>
    )
}

export default Card
