import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import api from '../utils/axios.utils.js'
import { sliceLogin, sliceLogout } from '../features/authSlice.js'
import { socket } from '../utils/socket.js'

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  useEffect(() => {
    const getCurrentUserInfo = async () => {
      try {
        const response = await api.get("/users/current-user");
        dispatch(sliceLogin(response.data.data.user));
        if (!socket.connected) {
          socket.connect();
        }
      } catch (error) {
        dispatch(sliceLogout());
        if (socket.connected) {
          socket.disconnect();
        }
      }
    };

    getCurrentUserInfo();

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [dispatch]);

  // Sync socket connection state with auth status
  useEffect(() => {
    if (!status && socket.connected) {
      socket.disconnect();
    }
  }, [status]);

  return children;
};

export default AuthInitializer;
