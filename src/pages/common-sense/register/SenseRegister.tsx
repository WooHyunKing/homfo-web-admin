import React, { useEffect, useState } from "react";
import * as S from "../../../styles/pages/common-sense/register/SenseRegister.style";
import { useRecoilState } from "recoil";
import {
  senseBannerAtom,
  senseContentAtom,
  senseIsPublicAtom,
  sensePosterListAtom,
  senseTitleAtom,
} from "../../../stores/senseAtom";
import Checkbox from "../../../components/checkbox/Checkbox";
import { postSense } from "../../../api/auth/api";
import instance from "../../../api/util/instance";
import { createSenseFormdata } from "../../../utils/util";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const SenseRegister = () => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [bannerPreviewImage, setBannerPreviewImage] = useState<string>("");
  const [banner, setBanner] = useRecoilState(senseBannerAtom);
  const [posterList, setPosterList] = useRecoilState(sensePosterListAtom);
  const [posterTitle, setPosterTitle] = useRecoilState(senseTitleAtom);
  const [posterContent, setPosterContent] = useRecoilState(senseContentAtom);
  const [isPublic, setIsPublic] = useRecoilState(senseIsPublicAtom);

  const navigate = useNavigate();

  useEffect(() => {
    if (posterList && posterList.length > 0) {
      let imageUrlList = [];

      for (let i = 0; i < posterList.length; i++) {
        const currentImageUrl = URL.createObjectURL(posterList[i]);
        imageUrlList.push(currentImageUrl);
      }

      setPreviewImages(imageUrlList);
    }
  }, [posterList]);

  useEffect(() => {
    if (banner) {
      setBannerPreviewImage(URL.createObjectURL(banner));
    }
  }, [banner]);

  const handleDeleteImage = (id: number) => {
    setPreviewImages(previewImages.filter((_, index) => index !== id));
    setPosterList(posterList.filter((_, index) => index !== id));
  };

  const postSense = async (
    bannerImage: File,
    images: File[],
    commonSense: {
      writerId: number;
      title: string;
      content: string;
      isPublic: string;
    }
  ) => {
    try {
      const response = await instance.post(
        "admins/senses",
        createSenseFormdata(bannerImage, images, commonSense),
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if (response.status === 201) {
        Swal.fire({
          text: "부동산 상식 등록이 완료되었습니다.",
        }).then(() => navigate("/common-sense"));
      }
    } catch (e: any) {
      Swal.fire({
        text: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  console.log(posterList);
  console.log(previewImages);
  console.log(banner);
  console.log(bannerPreviewImage);
  console.log(posterTitle);
  console.log(posterContent);

  return (
    <S.RegisterContainer>
      <S.InputArea>
        <S.CheckboxArea>
          <S.InputTitle>부동산 상식 이미지 업로드</S.InputTitle>
          <Checkbox
            content="공개 여부"
            checked={isPublic}
            setChange={setIsPublic}
          />
        </S.CheckboxArea>

        <S.ImageInputArea>
          <S.ImageInputLabel htmlFor="image">
            <S.CameraIcon />
          </S.ImageInputLabel>
          <S.ImageInput
            id="image"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              setPosterList((current) => {
                let tempList = [...current];
                if (e.currentTarget?.files) {
                  tempList.push(e.currentTarget?.files[0]);
                }
                return tempList;
              });
            }}
          />
          {previewImages.map((image, id) => (
            <S.ImageInputLabel as="div" key={id}>
              <S.PreviewImage src={image} alt={`${image}-${id}`} />
              <S.DeleteIcon onClick={() => handleDeleteImage(id)} />
            </S.ImageInputLabel>
          ))}
        </S.ImageInputArea>
      </S.InputArea>
      <S.InputArea>
        <S.InputTitle>배너 이미지 업로드 (최대 1개)</S.InputTitle>

        <S.ImageInputArea>
          <S.ImageInputLabel htmlFor="banner">
            <S.CameraIcon />
          </S.ImageInputLabel>
          <S.ImageInput
            id="banner"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.currentTarget.files) {
                setBanner(e.currentTarget.files[0]);
              }
            }}
          />
          {bannerPreviewImage ? (
            <S.ImageInputLabel as="div">
              <S.PreviewImage
                src={bannerPreviewImage}
                alt="bannerPreviewImage"
              />
              <S.DeleteIcon
                onClick={() => {
                  setBanner(undefined);
                  setBannerPreviewImage("");
                }}
              />
            </S.ImageInputLabel>
          ) : null}
        </S.ImageInputArea>
      </S.InputArea>
      <S.InputArea>
        <S.InputTitle>제목</S.InputTitle>
        <S.TitleInput
          value={posterTitle}
          onChange={(e) => {
            setPosterTitle(e.currentTarget.value);
          }}
        />
      </S.InputArea>
      <S.InputArea>
        <S.InputTitle>내용</S.InputTitle>
        <S.ContentInput
          value={posterContent}
          onChange={(e) => {
            setPosterContent(e.currentTarget.value);
          }}
        />
      </S.InputArea>

      <S.ButtonArea>
        <S.DeleteButton>삭제</S.DeleteButton>
        <S.ModifyButton>수정</S.ModifyButton>
        <S.RegisterButton
          onClick={() => {
            if (banner && posterList && posterTitle && posterContent) {
              postSense(banner, posterList, {
                writerId: parseInt(localStorage.getItem("userId") as string),
                title: posterTitle,
                content: posterContent,
                isPublic: isPublic ? "Y" : "N",
              });
            }
          }}
        >
          등록
        </S.RegisterButton>
      </S.ButtonArea>
    </S.RegisterContainer>
  );
};

export default SenseRegister;
