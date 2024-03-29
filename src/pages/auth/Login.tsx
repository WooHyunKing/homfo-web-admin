import React from "react";
import {
  InputText,
  InputTitle,
  InputWrapper,
  SubmitButton,
} from "../../styles/pages/auth/Signup.style";
import { useForm } from "react-hook-form";
import instance from "../../api/util/instance";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onValidLogin = async (data: any) => {
    try {
      const response = await instance.post("/admins/users/sign-in", {
        userAccount: data.userAccount,
        userPassword: data.userPassWord,
      });
      console.log(response);
      if (response.status === 200) {
        const response2 = await instance.get(
          `/admins/users/${response.data.userId}/info`
        );

        localStorage.setItem("nickName", response2.data.nickName);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("role", response.data.role);

        navigate("/service/agency-info");
      }
    } catch (e: any) {
      Swal.fire({
        text: e.response.data.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onValidLogin)}>
        <InputWrapper>
          <InputTitle>ID</InputTitle>
          <InputText {...register("userAccount")} type="text" />
        </InputWrapper>
        <InputWrapper>
          <InputTitle>Password</InputTitle>
          <InputText {...register("userPassWord")} type="password" />
        </InputWrapper>
        <SubmitButton>로그인</SubmitButton>
      </form>
      <SubmitButton onClick={() => navigate("/auth/signup")}>
        회원가입
      </SubmitButton>
    </div>
  );
};

export default Login;
