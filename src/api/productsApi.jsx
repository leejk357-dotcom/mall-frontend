// [역할] 상품 CRUD axios API 함수 모음. jwtAxios와 multipart/form-data 헤더를 사용해 Spring /api/products/** 엔드포인트에 요청하며 파일 업로드와 Soft Delete를 처리한다.
import axios from 'axios' // HTTP 요청 라이브러리
import {API_SERVER_HOST} from "./todoApi.jsx"; // Spring 서버 호스트 주소 (todoApi.jsx에서 공통으로 export)
import jwtAxios from "../util/jwtUtil.jsx"; // JWT 인터셉터가 적용된 axios 인스턴스

const host = `${API_SERVER_HOST}/api/products`; // 상품 API의 기본 URL

//API의 Controller의 각 Mapping의 return값을 res.data로 받아오는 것
export const postAdd = async (product) => {
  // 새 상품을 등록하는 함수
  // product: FormData 객체 → 파일(이미지)과 텍스트 데이터를 함께 전송
  const header = {headers: {'Content-Type': "multipart/form-data"}}
  // multipart/form-data: 파일 업로드 시 필수 → Spring의 @RequestParam MultipartFile[] 로 수신
  // Content-Type을 명시하지 않으면 axios가 JSON으로 전송 → Spring에서 파일을 받지 못함
  const res = await jwtAxios.post(`${host}/`, product, header)
  return res.data // Spring이 반환한 pno (생성된 상품 번호)
}

export const getList= async (pageParam) => {
  // 페이지 정보를 받아 상품 목록을 조회하는 함수
  const {page, size} = pageParam; // 구조 분해 할당
  // GET /api/products/list?page=1&size=10
  const res = await jwtAxios.get(`${host}/list`, {params: {page:page, size:size}});
  return res.data // PageResponseDTO { dtoList, pageNumList, prev, next, ... }
}

export const getOne = async (tno) => {
  // pno(상품번호)에 해당하는 상품 1개를 조회하는 함수
  // 파라미터명은 tno이지만 실제로는 pno 역할 (이름 불일치 - 실제 사용 시 pno 전달)
  const res = await jwtAxios.get(`${host}/${tno}`)
  return res.data // ProductDTO { pno, pname, price, pdesc, uploadFileNames, ... }
}

export const putOne = async (pno, product) => {
  // pno에 해당하는 상품을 수정하는 함수
  // product: FormData 객체 (수정된 이미지 포함 가능)
  const header = {headers: {'Content-Type': "multipart/form-data"}}
  const res = await jwtAxios.put(`${host}/${pno}`, product, header)
  // URL 경로에 pno 포함, 바디에 FormData 전송 → Spring의 @PutMapping("/{pno}") + @RequestParam 매핑
  return res.data
}

export const deleteOne = async (pno) => {
  // pno에 해당하는 상품을 삭제하는 함수 (실제로는 Soft Delete → delFlag = true)
  const res = await jwtAxios.delete(`${host}/${pno}`)
  return res.data // Spring이 반환한 결과 메시지
}
