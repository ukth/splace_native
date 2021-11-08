import React, { useState } from "react";

import IMP from "iamport-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const Payment = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      pay_method: string;
    };
  };
}) => {
  function callback(response: any) {
    navigation.push("Splace", response);
  }
  const { pay_method } = route.params;

  /* [필수입력] 결제에 필요한 데이터를 입력합니다. */
  const data = {
    pg: "inicis",
    pay_method,
    name: "아임포트 결제데이터 분석",
    merchant_uid: `mid_${new Date().getTime()}`,
    amount: "390",
    buyer_name: "홍길동",
    buyer_tel: "01012345678",
    buyer_email: "example@naver.com",
    buyer_addr: "서울시 강남구 신사동 661-16",
    buyer_postcode: "06018",
    app_scheme: "example",
    escrow: false, //????
    custom_data: {
      credit: 10,
      userId: 1,
    },
  };

  return (
    <IMP.Payment
      userCode={"imp05646507"} // 가맹점 식별코드
      // tierCode={"AAA"} // 티어 코드: agency 기능 사용자에 한함
      loading={<View />} // 로딩 컴포넌트
      data={data} // 결제 데이터
      callback={callback} // 결제 종료 후 콜백
    />
  );
};

export default Payment;
