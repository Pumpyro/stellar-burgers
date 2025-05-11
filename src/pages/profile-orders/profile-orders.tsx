import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { ordersSelectors } from '@slices';
import { useSelector } from '@store';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(ordersSelectors.selectOrders);

  return <ProfileOrdersUI orders={orders} />;
};
