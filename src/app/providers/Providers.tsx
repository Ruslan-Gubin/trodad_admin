import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persist, store } from "../store";
import Notification from '../../contexts/Notification';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persist} loading={null}>
      <Notification.Provider value={{name: 'Ant Design'}}>
        {children}
      </Notification.Provider>
      </PersistGate>
    </Provider>
  );
};
