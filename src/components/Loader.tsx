import { Spinner } from './ui/spinner'

const Loader = () => {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <Spinner className="size-10 text-indigo-500" />
    </div>
   
  )
}

export default Loader