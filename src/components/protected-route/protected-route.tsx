import React from 'react';
import { Preloader } from '@ui';
import { Navigate } from 'react-router-dom';
import { useSelector } from '@store';
import { userSelectors } from '@slices';

type ProtectedRouteProps = {
  children: React.ReactNode;
  isPublic?: boolean;
};

export const ProtectedRoute = ({ children, isPublic }: ProtectedRouteProps) => {
  const user = useSelector(userSelectors.selectUser);
  const checkUser = useSelector(userSelectors.selectUserChecked);

  if (!checkUser) {
    return <Preloader />;
  }

  if (isPublic && user) {
    return <Navigate to='/profile' />;
  }

  if (!isPublic && !user) {
    return <Navigate to='/login' />;
  }
  return children;
};
