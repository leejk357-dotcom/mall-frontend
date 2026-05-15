// [역할] Todo CRUD axios API 함수 모음. jwtAxios로 Spring /api/todo/** 엔드포인트에 요청하며 API_SERVER_HOST 상수를 내보내 다른 API 파일에 제공한다.
import axios from "axios"; // HTTP 요청 라이브러리 (jwtAxios의 기반)
import jwtAxios from "../util/jwtUtil.jsx"; // JWT 인터셉터가 적용된 axios 인스턴스 (Authorization 헤더 자동 첨부)

export const API_SERVER_HOST = 'http://localhost:8082'; // Spring 서버 주소 → 다른 API 파일에서 import해서 사용

const prefix = `${API_SERVER_HOST}/api/todo`; // Todo API의 기본 URL (템플릿 리터럴로 조합)

export const getOne = async (tno) => {
  // tno에 해당하는 Todo 1개를 조회하는 함수
  const res = await jwtAxios.get(`${prefix}/${tno}`)
  // jwtAxios: 헤더에 "Authorization: Bearer {accessToken}" 자동 첨부 → Spring의 JWTCheckFilter를 통과
  return res.data
  // axios 응답 구조: { data, status, headers, ... } → data만 추출해서 반환
}
/*
tno = 33이면
GET http://localhost:8080/api/t`odo/33
  ↓
Spring: @GetMapping("/{tno}") 매핑
        ↓
res.data = TodoDTO { tno, title, writer, ... }*/


export const getList = async (pageParam) => {
  // 페이지 정보를 받아 Todo 목록을 조회하는 함수
  const {page, size} = pageParam; // 구조 분해 할당 → pageParam.page, pageParam.size를 각각 변수로 추출
  const res = await jwtAxios.get(`${prefix}/list`, {params: {page: page, size: size}});
  // params 옵션: {page:1, size:10} → URL 쿼리스트링 자동 변환 → GET .../list?page=1&size=10
  return res.data
}
/*
pageParam = {page:1, size:10} 이면
GET http://localhost:8080/api/t`odo/list?page=1&size=10
  ↓
Spring: @GetMapping("/list") 매핑
        ↓
res.data = PageResponseDTO { dtoList, pageNumList, prev, next, ... }*/

// API 호출 함수를 별도 파일로 분리해서 컴포넌트에서는 getOne(33), getList({page:1, size:10}) 처럼 간단하게 호출만 하면 됩니다.

export const postAdd = async (todoObj) => {
  // 새 Todo를 등록하는 함수
  // todoObj = { title, writer, dueDate, complete } → Spring의 @RequestBody TodoDTO에 매핑
  const res = await jwtAxios.post(`${prefix}/`, todoObj);
  return res.data // Spring이 반환한 tno (생성된 Todo의 번호)
}

export const deleteOne = async (tno) => {
  // tno에 해당하는 Todo를 삭제하는 함수
  const res = await jwtAxios.delete(`${prefix}/${tno}`)
  return res.data // Spring이 반환한 "deleted" 문자열 또는 tno
}

export const putOne = async (todo) => {
  // tno에 해당하는 Todo를 수정하는 함수
  // todo = { tno, title, writer, dueDate, complete }
  const res = await jwtAxios.put(`${prefix}/${todo.tno}`, todo)
  // URL 경로에 tno 포함, 바디에 전체 todo 객체 전송 → Spring의 @PutMapping("/{tno}") + @RequestBody 매핑
  return res.data
}
