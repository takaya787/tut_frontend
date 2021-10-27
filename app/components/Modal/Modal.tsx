import { useState } from "react";
import styles from "./Modal.module.scss";
//components
import { UserForm } from "./UserForm";
import { LoginForm } from "./LoginForm";
import { PasswordResetForm } from "./PasswordResetForm";

type ModalPropsType = {
  title: string;
};

export const Modal: React.FC<ModalPropsType> = ({ title }) => {
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false);
  //formの開け締めを管理する
  const [isOpen, setIsOpen] = useState(false);
  const Closemodal = (): void => {
    setIsSignup(false);
    setIsLogin(false);
    setIsPasswordReset(false);
    setIsOpen(false);
  };
  const Signupcontroll = (): void => {
    setIsSignup(!isSignup);
    setIsLogin(false);
    setIsPasswordReset(false);
    setIsOpen(true);
  };
  const Logincontroll = (): void => {
    setIsSignup(false);
    setIsPasswordReset(false);
    setIsLogin(!isLogin);
    setIsOpen(true);
  };

  const PasswordResetcontroll = (): void => {
    setIsSignup(false);
    setIsPasswordReset(!isPasswordReset);
    setIsLogin(false);
    setIsOpen(true);
  };

  return (
    <>
      {/* 始めはボタンが表示される */}
      {!isOpen && (
        <button onClick={Signupcontroll} className={styles.initial}>
          {title}
        </button>
      )}

      {/* Sign up用のformが表示される */}
      {isOpen && (
        <div className={styles.modal}>
          <div className={styles.content}>
            <button className={styles.content_close} onClick={Closemodal}>
              ×
            </button>
            {/* signup用のformが表示される */}
            {isSignup && (
              <>
                <h2 className={styles.content_title}>Sign up！</h2>
                <UserForm Closemodal={Closemodal} />
                <button className={styles.content_switch} onClick={Logincontroll}>
                  Login is Here!
                </button>
              </>
            )}
            {/* Login用のformが表示される */}
            {isLogin && (
              <>
                <h2 className={styles.content_title}>Log in！</h2>
                <LoginForm Closemodal={Closemodal} PasswordResetControll={PasswordResetcontroll} />
                <button className={styles.content_switch} onClick={Signupcontroll}>
                  Sign up is Here!
                </button>
              </>
            )}
            {isPasswordReset && (
              <>
                <h2 className={`${styles.content_title} text-danger my-0`}>Password Reset!</h2>
                <p className={"text-danger text-left my-2 ml-4"}>
                  The Password Reset Link is sent to <br />
                  your emaill adress after confirming your address.
                </p>

                <PasswordResetForm Closemodal={Closemodal} />
                <button className={styles.content_switch} onClick={Logincontroll}>
                  Back to Login Form!
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
