import React, { memo, useCallback, useMemo } from "react";
import { Button, useInput } from "@/modules/base";

const Login = () => {
  const { value: email, handleOnChange: handleSetEmail } = useInput("");
  const { value: password, handleOnChange: handleSetPassword } = useInput("");

  const isDisabled = useMemo(() => {
    return !email || !password;
  }, [email, password]);

  return (
    <div className="login-container">
      <form
        className="login-form flex-col flex lg:flex-row"
      >
        <input
          autoFocus
          name="email"
          type="email"
          placeholder="Email"
          aria-label="email"
          value={email}
          className="lg:mr-8 h-[40px] px-8 mt-12 lg:mt-0 border rounded-medium border-gray-300"
          onChange={handleSetEmail}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          aria-label="password"
          value={password}
          className="lg:mr-8 h-[40px] px-8 border mt-12 lg:mt-0 rounded-medium border-gray-300"
          onChange={handleSetPassword}
        />
        <Button type="submit" isDisable={isDisabled} label="Login / Register" className="px-8 lg:mt-0 h-[40px] mt-12 rounded-medium" />
      </form>
    </div>
  );
};

export default memo(Login);
