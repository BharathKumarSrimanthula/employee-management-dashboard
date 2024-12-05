import React, { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";

const ToastComponent = ({ severity, summary, detail, life = 5000 }) => {
  const toastRef = useRef(null);

  useEffect(() => {
    if (toastRef.current && severity) {
      toastRef.current.show({
        severity,
        summary,
        detail,
        life,
      });
    }
  }, [severity, summary, detail, life]);
  return <Toast ref={toastRef} />;
};

export default ToastComponent;
