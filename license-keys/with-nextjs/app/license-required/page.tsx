


type Props = {
  searchParams: {
    error:string
  }
}

export default function Page(props:Props){

  return <div className="flex items-center justify-center w-screen h-screen text-center">
    <div>

    <h1 className="text-4xl">License Required</h1>
    
    <p className="mt-4 font-mono">{props.searchParams.error}</p>
    </div>
  </div>
}