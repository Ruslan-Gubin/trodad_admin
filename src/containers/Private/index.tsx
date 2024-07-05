import {Navigate, Outlet, useLocation} from "react-router";
import { useAuthSelect } from '../../slices/auth-slice';

type PrivatePropsType = {
  redirectPath?: string;
  children?: any;
};

const Private: React.FC<PrivatePropsType> = ({redirectPath = '/auth', children}) => {
  const location = useLocation();
  const auth = useAuthSelect();

  if (!auth.authorization) {
    return <Navigate to={redirectPath} replace state={{ from: location.pathname + location.search }} />;
  }

  return children || <Outlet />;
};
export default Private;