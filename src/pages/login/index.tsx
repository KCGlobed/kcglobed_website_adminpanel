import React, { useEffect, useState } from 'react';
import type { LoginCred } from '../../utils/types';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../store/slices/authSlice';
import { useLoading } from '../../context/LoadingContext';
import { changeMode } from '../../utils/constants';
import { useAppDispatch } from '../../hooks/useRedux';
import { FaEye } from 'react-icons/fa';


const Login:React.FC = () => {

  const [loginCred, setLoginCred] = useState<LoginCred>({email : '', password : ''});
  const [showPassword, setShowPassword] = useState<Boolean>(false)
  const { showLoading, hideLoading } = useLoading();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
   const [isProd, setIsProd] = useState<boolean>(false);

  useEffect(() => {
    const mode = localStorage.getItem('app_mode');
    setIsProd(mode === 'production');
  }, []);

  const handleToggle = () => {
    changeMode(!isProd); // This will also reload the page
  };

  const onLoggedInClick = async () => {
    showLoading();
    const result = await dispatch(loginUser(loginCred));
    if (loginUser.fulfilled.match(result)) {
      hideLoading();
      navigate("/dashboard/books");
    } else {
      hideLoading();
      alert("Login failed");
    }
  };

  const updateCred = (e:any)=>{
    const key = e.target.name;
    loginCred[key as keyof LoginCred] = e.target.value;
    setLoginCred(loginCred);
  }
  
  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to KCAdmin</h2>
        <form>
          <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            name="email"
            type="email"
            onChange={updateCred}
            placeholder="you@example.com"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <div className="relative mb-6">
  <input
    name="password"
    type={showPassword ? "text" : "password"}
    onChange={updateCred}
    placeholder="••••••••"
    className="w-full p-2 border border-gray-300 rounded pr-10"
  />

  <FaEye
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
  />
</div>
          <button
            type="button"
            onClick={onLoggedInClick}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Login
          </button>
        </form>
        <button
        onClick={handleToggle}
        className={`w-full py-2 mt-2 px-4 rounded-lg text-white transition cursor-pointer ${
          isProd ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isProd ? 'Switch to Development' : 'Switch to Production'}
      </button>
      </div>
    </div>
  );
};

export default Login;
