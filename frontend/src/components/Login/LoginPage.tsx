
import Login from './Login'

function LoginPage({ closeButton = false }: { closeButton: boolean }) {
  return (
    <div className='h-[100%] flex justify-center items-center bg-[#7b312D]'>
      <Login closeButton={closeButton} />
    </div>
  )
}

export default LoginPage

