-- ============================================================================
-- 0009. 시드 데이터: 정적 TS 파일 → project_categories / projects / project_images
-- scripts/generate-seed.ts 로 자동 생성됨. 데이터 소스가 바뀌면 스크립트를 다시 실행해 재생성할 것.
-- 전량 지명원(공사지명원, 2025-10-14) 기재 내용 기반이며, on conflict do nothing으로 재실행해도 안전하다.
-- ============================================================================

-- 1) 시공실적 카테고리 (kind=construction)
insert into public.project_categories (kind, slug, label, description, sort_order) values ('construction', 'public', '공공기관', '구청·행정복지센터·시설공단·고용센터·관광공사 등', 0) on conflict (kind, slug) do nothing;
insert into public.project_categories (kind, slug, label, description, sort_order) values ('construction', 'hospital', '병원', '적십자병원·한방병원·요양병원 등', 1) on conflict (kind, slug) do nothing;
insert into public.project_categories (kind, slug, label, description, sort_order) values ('construction', 'school', '학교', '초·중·고등학교 및 대학 캠퍼스', 2) on conflict (kind, slug) do nothing;
insert into public.project_categories (kind, slug, label, description, sort_order) values ('construction', 'welfare', '복지시설', '주간보호센터·복지관·장애인쉼터·어린이집·돌봄센터 등', 3) on conflict (kind, slug) do nothing;
insert into public.project_categories (kind, slug, label, description, sort_order) values ('construction', 'lh', 'LH', '한국토지주택공사 관련 실적', 4) on conflict (kind, slug) do nothing;
insert into public.project_categories (kind, slug, label, description, sort_order) values ('construction', 'urban-corp', '도시공사', '서울주택도시공사·인천도시공사 등', 5) on conflict (kind, slug) do nothing;
insert into public.project_categories (kind, slug, label, description, sort_order) values ('construction', 'military', '군부대', 'OO부대·보병사단·해군·해양경찰청·소방서 등', 6) on conflict (kind, slug) do nothing;
insert into public.project_categories (kind, slug, label, description, sort_order) values ('construction', 'commercial', '상업시설', '개인·법인 의뢰 상업 인테리어', 7) on conflict (kind, slug) do nothing;

-- 2) 화재복구 사례 카테고리 (kind=fire_case, 사례 데이터는 아직 없음 - 분류만 준비)
insert into public.project_categories (kind, slug, label, description, sort_order) values ('fire_case', 'housing', '주택·아파트', null, 0) on conflict (kind, slug) do nothing;
insert into public.project_categories (kind, slug, label, description, sort_order) values ('fire_case', 'commercial', '상가', null, 1) on conflict (kind, slug) do nothing;
insert into public.project_categories (kind, slug, label, description, sort_order) values ('fire_case', 'factory', '공장·창고', null, 2) on conflict (kind, slug) do nothing;
insert into public.project_categories (kind, slug, label, description, sort_order) values ('fire_case', 'office', '사무실', null, 3) on conflict (kind, slug) do nothing;
insert into public.project_categories (kind, slug, label, description, sort_order) values ('fire_case', 'public', '공공시설', null, 4) on conflict (kind, slug) do nothing;
insert into public.project_categories (kind, slug, label, description, sort_order) values ('fire_case', 'odor', '그을음·냄새제거', null, 5) on conflict (kind, slug) do nothing;
insert into public.project_categories (kind, slug, label, description, sort_order) values ('fire_case', 'demolition', '철거·폐기물처리', null, 6) on conflict (kind, slug) do nothing;

-- 3) 시공실적 - 실제 시공사진 보유 27건 (지명원 III.포트폴리오)
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'incheon-medical-tourism', '인천환승의료관광홍보관',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천관광공사', '공공시설', '실내인테리어', '2016.04',
  ARRAY['실내인테리어']::text[], '2016.04 인천관광공사 발주로 진행된 시공 사례입니다(실내인테리어). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/incheon-medical-tourism/0.jpg', true, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/incheon-medical-tourism/0.jpg', null, false, 0
from public.projects where slug = 'incheon-medical-tourism'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'somnus', '솜누스',
  (select id from public.project_categories where kind = 'construction' and slug = 'commercial'),
  'C&P BIO', '상가', '실내인테리어', '2017.04',
  ARRAY['실내인테리어']::text[], '2017.04 C&P BIO 실내인테리어. 지명원 포트폴리오에 실린 3D 렌더링(설계 제안) 이미지이며, 실제 준공 시공사진이 아닙니다.', '/images/construction/somnus/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/somnus/0.jpg', null, false, 0
from public.projects where slug = 'somnus'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/somnus/1.jpg', null, true, 1
from public.projects where slug = 'somnus'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'hwajeong-bom-clinic', '화정동 봄여성의원',
  (select id from public.project_categories where kind = 'construction' and slug = 'hospital'),
  '개인의뢰', '병원', '실내인테리어', '2019.05',
  ARRAY['실내인테리어']::text[], '2019.05 개인의뢰 발주로 진행된 시공 사례입니다(실내인테리어). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/hwajeong-bom-clinic/0.jpg', true, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/hwajeong-bom-clinic/0.jpg', null, false, 0
from public.projects where slug = 'hwajeong-bom-clinic'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/hwajeong-bom-clinic/1.jpg', null, false, 1
from public.projects where slug = 'hwajeong-bom-clinic'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/hwajeong-bom-clinic/2.jpg', null, false, 2
from public.projects where slug = 'hwajeong-bom-clinic'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/hwajeong-bom-clinic/3.jpg', null, false, 3
from public.projects where slug = 'hwajeong-bom-clinic'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'okgil-daycare', '옥길동 주간보호센터',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '개인의뢰', '복지시설', '실내인테리어', '2019.08',
  ARRAY['실내인테리어']::text[], '2019.08 개인의뢰 발주로 진행된 시공 사례입니다(실내인테리어). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/okgil-daycare/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/okgil-daycare/0.jpg', null, false, 0
from public.projects where slug = 'okgil-daycare'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/okgil-daycare/1.jpg', null, false, 1
from public.projects where slug = 'okgil-daycare'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/okgil-daycare/2.jpg', null, false, 2
from public.projects where slug = 'okgil-daycare'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/okgil-daycare/3.jpg', null, false, 3
from public.projects where slug = 'okgil-daycare'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/okgil-daycare/4.jpg', null, false, 4
from public.projects where slug = 'okgil-daycare'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cheongna-chowon-daycare-1', '청라초원주간보호센터',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '개인의뢰', '복지시설', '실내인테리어', '2020.01',
  ARRAY['실내인테리어']::text[], '2020.01 개인의뢰 발주로 진행된 시공 사례입니다(실내인테리어). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/cheongna-chowon-daycare-1/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/cheongna-chowon-daycare-1/0.jpg', null, false, 0
from public.projects where slug = 'cheongna-chowon-daycare-1'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/cheongna-chowon-daycare-1/1.jpg', null, false, 1
from public.projects where slug = 'cheongna-chowon-daycare-1'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/cheongna-chowon-daycare-1/2.jpg', null, false, 2
from public.projects where slug = 'cheongna-chowon-daycare-1'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cheongna-chowon-daycare-2', '청라 초원노인주간보호센터',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '개인의뢰', '복지시설', '실내인테리어', '2020.01',
  ARRAY['실내인테리어']::text[], '2020.01 개인의뢰 발주로 진행된 시공 사례입니다(실내인테리어). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/cheongna-chowon-daycare-2/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/cheongna-chowon-daycare-2/0.jpg', null, false, 0
from public.projects where slug = 'cheongna-chowon-daycare-2'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/cheongna-chowon-daycare-2/1.jpg', null, false, 1
from public.projects where slug = 'cheongna-chowon-daycare-2'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/cheongna-chowon-daycare-2/2.jpg', null, false, 2
from public.projects where slug = 'cheongna-chowon-daycare-2'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/cheongna-chowon-daycare-2/3.jpg', null, false, 3
from public.projects where slug = 'cheongna-chowon-daycare-2'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'jungang-hanbang-hospital', '중앙한방병원',
  (select id from public.project_categories where kind = 'construction' and slug = 'hospital'),
  '중앙한방병원', '병원', '실내인테리어', '2020.03',
  ARRAY['실내인테리어']::text[], '2020.03 중앙한방병원 발주로 진행된 시공 사례입니다(실내인테리어). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/jungang-hanbang-hospital/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/jungang-hanbang-hospital/0.jpg', null, false, 0
from public.projects where slug = 'jungang-hanbang-hospital'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/jungang-hanbang-hospital/1.jpg', null, false, 1
from public.projects where slug = 'jungang-hanbang-hospital'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/jungang-hanbang-hospital/2.jpg', null, false, 2
from public.projects where slug = 'jungang-hanbang-hospital'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'incheon-port-terminal-hall', '인천항 여객터미널 인천관광공사 홍보관',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천관광공사', '공공시설', '실내인테리어', '2020.06',
  ARRAY['실내인테리어']::text[], '2020.06 인천관광공사 실내인테리어. 지명원 포트폴리오에 실린 3D 렌더링(설계 제안) 이미지이며, 실제 준공 시공사진이 아닙니다.', '/images/construction/incheon-port-terminal-hall/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/incheon-port-terminal-hall/0.jpg', null, true, 0
from public.projects where slug = 'incheon-port-terminal-hall'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/incheon-port-terminal-hall/1.jpg', null, true, 1
from public.projects where slug = 'incheon-port-terminal-hall'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'gajwa3-hana-daycare', '국공립 가좌3동 하나어린이집 환경개선공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '국공립 가좌3동 하나어린이집', '복지시설', '실내인테리어', '2020.10',
  ARRAY['실외(도로공사·전동어닝·전기) / 실내(도배·시트지·보일러 등)']::text[], '2020.10 국공립 가좌3동 하나어린이집 발주로 진행된 시공 사례입니다(실외(도로공사·전동어닝·전기) / 실내(도배·시트지·보일러 등)). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/gajwa3-hana-daycare/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/gajwa3-hana-daycare/0.jpg', null, false, 0
from public.projects where slug = 'gajwa3-hana-daycare'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/gajwa3-hana-daycare/1.jpg', null, false, 1
from public.projects where slug = 'gajwa3-hana-daycare'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/gajwa3-hana-daycare/2.jpg', null, false, 2
from public.projects where slug = 'gajwa3-hana-daycare'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/gajwa3-hana-daycare/3.jpg', null, false, 3
from public.projects where slug = 'gajwa3-hana-daycare'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/gajwa3-hana-daycare/4.jpg', null, false, 4
from public.projects where slug = 'gajwa3-hana-daycare'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/gajwa3-hana-daycare/5.jpg', null, false, 5
from public.projects where slug = 'gajwa3-hana-daycare'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'bupyeong-jaega-center', '부평종합재가센터 사무실',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '인천복지재단', '복지시설', '실내인테리어', '2020.12',
  ARRAY['실내인테리어']::text[], '2020.12 인천복지재단 발주로 진행된 시공 사례입니다(실내인테리어). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/bupyeong-jaega-center/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/bupyeong-jaega-center/0.jpg', null, false, 0
from public.projects where slug = 'bupyeong-jaega-center'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/bupyeong-jaega-center/1.jpg', null, false, 1
from public.projects where slug = 'bupyeong-jaega-center'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/bupyeong-jaega-center/2.jpg', null, false, 2
from public.projects where slug = 'bupyeong-jaega-center'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'songdo-convensia-office', '송도컨벤시아 1주차장 주최자 사무실',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '송도컨벤시아', '공공시설', '실내인테리어', '2021.08',
  ARRAY['실내인테리어']::text[], '2021.08 송도컨벤시아 발주로 진행된 시공 사례입니다(실내인테리어). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/songdo-convensia-office/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/songdo-convensia-office/0.jpg', null, false, 0
from public.projects where slug = 'songdo-convensia-office'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/songdo-convensia-office/1.jpg', null, false, 1
from public.projects where slug = 'songdo-convensia-office'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'uijeongbu-barreuljeong-hospital', '의정부 바를정 한방병원',
  (select id from public.project_categories where kind = 'construction' and slug = 'hospital'),
  '의정부 바를정 한방병원', '병원', '실내인테리어', '2021.10',
  ARRAY['실내인테리어']::text[], '2021.10 의정부 바를정 한방병원 발주로 진행된 시공 사례입니다(실내인테리어). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/uijeongbu-barreuljeong-hospital/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/uijeongbu-barreuljeong-hospital/0.jpg', null, false, 0
from public.projects where slug = 'uijeongbu-barreuljeong-hospital'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/uijeongbu-barreuljeong-hospital/1.jpg', null, false, 1
from public.projects where slug = 'uijeongbu-barreuljeong-hospital'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/uijeongbu-barreuljeong-hospital/2.jpg', null, false, 2
from public.projects where slug = 'uijeongbu-barreuljeong-hospital'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/uijeongbu-barreuljeong-hospital/3.jpg', null, false, 3
from public.projects where slug = 'uijeongbu-barreuljeong-hospital'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/uijeongbu-barreuljeong-hospital/4.jpg', null, false, 4
from public.projects where slug = 'uijeongbu-barreuljeong-hospital'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'michuhol-media-park', '미추홀구청 미디어파크 조성공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '미추홀구청', '공공시설', '실내인테리어', '2021.11',
  ARRAY['실내인테리어']::text[], '2021.11 미추홀구청 발주로 진행된 시공 사례입니다(실내인테리어). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/michuhol-media-park/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/michuhol-media-park/0.jpg', null, false, 0
from public.projects where slug = 'michuhol-media-park'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/michuhol-media-park/1.jpg', null, false, 1
from public.projects where slug = 'michuhol-media-park'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/michuhol-media-park/2.jpg', null, false, 2
from public.projects where slug = 'michuhol-media-park'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/michuhol-media-park/3.jpg', null, false, 3
from public.projects where slug = 'michuhol-media-park'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/michuhol-media-park/4.jpg', null, false, 4
from public.projects where slug = 'michuhol-media-park'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/michuhol-media-park/5.jpg', null, false, 5
from public.projects where slug = 'michuhol-media-park'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'yeonhui-bukcafe', '연희동 행정복지센터 북카페 리모델링공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 서구 연희동 행정복지센터', '공공시설', '리모델링', '2021.11',
  ARRAY['연희동 행정복지센터2층 북카페 리모델링 공사']::text[], '2021.11 인천광역시 서구 연희동 행정복지센터 발주로 진행된 시공 사례입니다(연희동 행정복지센터2층 북카페 리모델링 공사). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/yeonhui-bukcafe/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/yeonhui-bukcafe/0.jpg', null, false, 0
from public.projects where slug = 'yeonhui-bukcafe'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/yeonhui-bukcafe/1.jpg', null, false, 1
from public.projects where slug = 'yeonhui-bukcafe'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/yeonhui-bukcafe/2.jpg', null, false, 2
from public.projects where slug = 'yeonhui-bukcafe'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'dahamkke-5', '다함께 돌봄센터 5호점',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '인천광역시 미추홀구', '복지시설', '리모델링', '2022.10',
  ARRAY['미추홀구 다함께돌봄센터 4,5호점 리모델링 공사(건축)']::text[], '2022.10 인천광역시 미추홀구 발주로 진행된 시공 사례입니다(미추홀구 다함께돌봄센터 4,5호점 리모델링 공사(건축)). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/dahamkke-5/0.jpg', true, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/dahamkke-5/0.jpg', null, false, 0
from public.projects where slug = 'dahamkke-5'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/dahamkke-5/1.jpg', null, false, 1
from public.projects where slug = 'dahamkke-5'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/dahamkke-5/2.jpg', null, false, 2
from public.projects where slug = 'dahamkke-5'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/dahamkke-5/3.jpg', null, false, 3
from public.projects where slug = 'dahamkke-5'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/dahamkke-5/4.jpg', null, false, 4
from public.projects where slug = 'dahamkke-5'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/dahamkke-5/5.jpg', null, false, 5
from public.projects where slug = 'dahamkke-5'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'isarang-ggumteo-ganghwa', '아이사랑꿈터',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '인천광역시 강화군', '복지시설', '신축·조성', '2021.12',
  ARRAY['아이사랑꿈터(강화군 1호점) 그래픽 및 로고 설치공사']::text[], '2021.12 인천광역시 강화군 발주로 진행된 시공 사례입니다(아이사랑꿈터(강화군 1호점) 그래픽 및 로고 설치공사). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/isarang-ggumteo-ganghwa/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/isarang-ggumteo-ganghwa/0.jpg', null, false, 0
from public.projects where slug = 'isarang-ggumteo-ganghwa'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/isarang-ggumteo-ganghwa/1.jpg', null, false, 1
from public.projects where slug = 'isarang-ggumteo-ganghwa'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/isarang-ggumteo-ganghwa/2.jpg', null, false, 2
from public.projects where slug = 'isarang-ggumteo-ganghwa'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/isarang-ggumteo-ganghwa/3.jpg', null, false, 3
from public.projects where slug = 'isarang-ggumteo-ganghwa'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/isarang-ggumteo-ganghwa/4.jpg', null, false, 4
from public.projects where slug = 'isarang-ggumteo-ganghwa'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/isarang-ggumteo-ganghwa/5.jpg', null, false, 5
from public.projects where slug = 'isarang-ggumteo-ganghwa'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'munhak-high-school', '문학고등학교',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인천문학정보고등학교', '학교', '실내인테리어', '2023.12',
  ARRAY['문학정보고등학교 실험실습실 공간혁신 및 재구조화 사업']::text[], '2023.12 인천문학정보고등학교 발주로 진행된 시공 사례입니다(문학정보고등학교 실험실습실 공간혁신 및 재구조화 사업). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/munhak-high-school/0.jpg', true, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/munhak-high-school/0.jpg', null, false, 0
from public.projects where slug = 'munhak-high-school'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/munhak-high-school/1.jpg', null, false, 1
from public.projects where slug = 'munhak-high-school'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/munhak-high-school/2.jpg', null, false, 2
from public.projects where slug = 'munhak-high-school'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/munhak-high-school/3.jpg', null, false, 3
from public.projects where slug = 'munhak-high-school'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/munhak-high-school/4.jpg', null, false, 4
from public.projects where slug = 'munhak-high-school'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/munhak-high-school/5.jpg', null, false, 5
from public.projects where slug = 'munhak-high-school'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'isarang-ggumteo-michuhol-8', '아이사랑꿈터 미추홀구 8호점 리모델링',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '인천광역시 미추홀구', '복지시설', '리모델링', '2024.06',
  ARRAY['아이사랑꿈터 미추홀구 8호점 리모델링 공사(건축)']::text[], '2024.06 인천광역시 미추홀구 발주로 진행된 시공 사례입니다(아이사랑꿈터 미추홀구 8호점 리모델링 공사(건축)). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/isarang-ggumteo-michuhol-8/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/isarang-ggumteo-michuhol-8/0.jpg', null, false, 0
from public.projects where slug = 'isarang-ggumteo-michuhol-8'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/isarang-ggumteo-michuhol-8/1.jpg', null, false, 1
from public.projects where slug = 'isarang-ggumteo-michuhol-8'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/isarang-ggumteo-michuhol-8/2.jpg', null, false, 2
from public.projects where slug = 'isarang-ggumteo-michuhol-8'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/isarang-ggumteo-michuhol-8/3.jpg', null, false, 3
from public.projects where slug = 'isarang-ggumteo-michuhol-8'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/isarang-ggumteo-michuhol-8/4.jpg', null, false, 4
from public.projects where slug = 'isarang-ggumteo-michuhol-8'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/isarang-ggumteo-michuhol-8/5.jpg', null, false, 5
from public.projects where slug = 'isarang-ggumteo-michuhol-8'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'unit5378-mess-hall', '제5378부대 병영식당 개선공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '제5378부대', '군시설', '실내인테리어', '2024.08',
  ARRAY['"나" 지역지역 더 좋은병영식당 개선공사 (금속창호)']::text[], '2024.08 제5378부대 발주로 진행된 시공 사례입니다("나" 지역지역 더 좋은병영식당 개선공사 (금속창호)). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/unit5378-mess-hall/0.jpg', true, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/unit5378-mess-hall/0.jpg', null, false, 0
from public.projects where slug = 'unit5378-mess-hall'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/unit5378-mess-hall/1.jpg', null, false, 1
from public.projects where slug = 'unit5378-mess-hall'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/unit5378-mess-hall/2.jpg', null, false, 2
from public.projects where slug = 'unit5378-mess-hall'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/unit5378-mess-hall/3.jpg', null, false, 3
from public.projects where slug = 'unit5378-mess-hall'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/unit5378-mess-hall/4.jpg', null, false, 4
from public.projects where slug = 'unit5378-mess-hall'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/unit5378-mess-hall/5.jpg', null, false, 5
from public.projects where slug = 'unit5378-mess-hall'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'seogu-welfare-foundation-office', '인천서구복지재단 사무실공사(건축)',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '인천광역시 서구', '복지시설', '실내인테리어', '2024.04',
  ARRAY['인천서구복지재단 사무실공사(건축)']::text[], '2024.04 인천광역시 서구 발주로 진행된 시공 사례입니다(인천서구복지재단 사무실공사(건축)). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/seogu-welfare-foundation-office/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/seogu-welfare-foundation-office/0.jpg', null, false, 0
from public.projects where slug = 'seogu-welfare-foundation-office'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/seogu-welfare-foundation-office/1.jpg', null, false, 1
from public.projects where slug = 'seogu-welfare-foundation-office'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/seogu-welfare-foundation-office/2.jpg', null, false, 2
from public.projects where slug = 'seogu-welfare-foundation-office'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/seogu-welfare-foundation-office/3.jpg', null, false, 3
from public.projects where slug = 'seogu-welfare-foundation-office'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/seogu-welfare-foundation-office/4.jpg', null, false, 4
from public.projects where slug = 'seogu-welfare-foundation-office'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/seogu-welfare-foundation-office/5.jpg', null, false, 5
from public.projects where slug = 'seogu-welfare-foundation-office'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'seodongi-daycare', '서동이 어린이집 리모델링 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '서동이어린이집(인천서구)', '복지시설', '리모델링', '2024.09',
  ARRAY['서동이 어린이집 리모델링 공사']::text[], '2024.09 서동이어린이집(인천서구) 발주로 진행된 시공 사례입니다(서동이 어린이집 리모델링 공사). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/seodongi-daycare/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/seodongi-daycare/0.jpg', null, false, 0
from public.projects where slug = 'seodongi-daycare'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/seodongi-daycare/1.jpg', null, false, 1
from public.projects where slug = 'seodongi-daycare'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/seodongi-daycare/2.jpg', null, false, 2
from public.projects where slug = 'seodongi-daycare'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/seodongi-daycare/3.jpg', null, false, 3
from public.projects where slug = 'seodongi-daycare'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/seodongi-daycare/4.jpg', null, false, 4
from public.projects where slug = 'seodongi-daycare'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/seodongi-daycare/5.jpg', null, false, 5
from public.projects where slug = 'seodongi-daycare'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'incheon-ara-highschool', '인천아라고등학교 미래교실 및 AI교실 구축공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인천아라고등학교', '학교', '신축·조성', '2024.02',
  ARRAY['인천아라고등학교 미래교실 및 AI교실 구축공사']::text[], '2024.02 인천아라고등학교 발주로 진행된 시공 사례입니다(인천아라고등학교 미래교실 및 AI교실 구축공사). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/incheon-ara-highschool/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/incheon-ara-highschool/0.jpg', null, false, 0
from public.projects where slug = 'incheon-ara-highschool'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/incheon-ara-highschool/1.jpg', null, false, 1
from public.projects where slug = 'incheon-ara-highschool'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/incheon-ara-highschool/2.jpg', null, false, 2
from public.projects where slug = 'incheon-ara-highschool'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/incheon-ara-highschool/3.jpg', null, false, 3
from public.projects where slug = 'incheon-ara-highschool'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/incheon-ara-highschool/4.jpg', null, false, 4
from public.projects where slug = 'incheon-ara-highschool'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/incheon-ara-highschool/5.jpg', null, false, 5
from public.projects where slug = 'incheon-ara-highschool'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'yeongjong-skyville-apt', '영종 스카이빌 아파트 실내인테리어 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '제17보병사단', '군시설', '실내인테리어', '2024.07',
  ARRAY['주거대17)영종스카이빌 아파트 보수공사(건축)']::text[], '2024.07 제17보병사단 발주로 진행된 시공 사례입니다(주거대17)영종스카이빌 아파트 보수공사(건축)). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/yeongjong-skyville-apt/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/yeongjong-skyville-apt/0.jpg', null, false, 0
from public.projects where slug = 'yeongjong-skyville-apt'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/yeongjong-skyville-apt/1.jpg', null, false, 1
from public.projects where slug = 'yeongjong-skyville-apt'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/yeongjong-skyville-apt/2.jpg', null, false, 2
from public.projects where slug = 'yeongjong-skyville-apt'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/yeongjong-skyville-apt/3.jpg', null, false, 3
from public.projects where slug = 'yeongjong-skyville-apt'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/yeongjong-skyville-apt/4.jpg', null, false, 4
from public.projects where slug = 'yeongjong-skyville-apt'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/yeongjong-skyville-apt/5.jpg', null, false, 5
from public.projects where slug = 'yeongjong-skyville-apt'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'rosy-popup-garden', '장밋빛팝업가든',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '신축·조성', '2024.05',
  ARRAY['장밋빛팝업가든 조성을위한 포토존제작설치(금속창호)']::text[], '2024.05 인천시설공단 발주로 진행된 시공 사례입니다(장밋빛팝업가든 조성을위한 포토존제작설치(금속창호)). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/rosy-popup-garden/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/rosy-popup-garden/0.jpg', null, false, 0
from public.projects where slug = 'rosy-popup-garden'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/rosy-popup-garden/1.jpg', null, false, 1
from public.projects where slug = 'rosy-popup-garden'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/rosy-popup-garden/2.jpg', null, false, 2
from public.projects where slug = 'rosy-popup-garden'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/rosy-popup-garden/3.jpg', null, false, 3
from public.projects where slug = 'rosy-popup-garden'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/rosy-popup-garden/4.jpg', null, false, 4
from public.projects where slug = 'rosy-popup-garden'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/rosy-popup-garden/5.jpg', null, false, 5
from public.projects where slug = 'rosy-popup-garden'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cheongna-huiraegaek', '청라 희래객',
  (select id from public.project_categories where kind = 'construction' and slug = 'commercial'),
  '청라 희래객', '상가', '실내인테리어', '2024.05',
  ARRAY['점포 디자인 및 인테리어 공사']::text[], '2024.05 청라 희래객 발주로 진행된 시공 사례입니다(점포 디자인 및 인테리어 공사). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/cheongna-huiraegaek/0.jpg', true, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/cheongna-huiraegaek/0.jpg', null, false, 0
from public.projects where slug = 'cheongna-huiraegaek'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/cheongna-huiraegaek/1.jpg', null, false, 1
from public.projects where slug = 'cheongna-huiraegaek'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/cheongna-huiraegaek/2.jpg', null, false, 2
from public.projects where slug = 'cheongna-huiraegaek'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/cheongna-huiraegaek/3.jpg', null, false, 3
from public.projects where slug = 'cheongna-huiraegaek'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/cheongna-huiraegaek/4.jpg', null, false, 4
from public.projects where slug = 'cheongna-huiraegaek'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/cheongna-huiraegaek/5.jpg', null, false, 5
from public.projects where slug = 'cheongna-huiraegaek'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'unit-bathhouse', '부대 목욕탕 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '제17보병사단', '군시설', '실내인테리어', '2024.08',
  ARRAY['위임48)00부대 목욕탕 보수공사(습식방수)']::text[], '2024.08 제17보병사단 발주로 진행된 시공 사례입니다(위임48)00부대 목욕탕 보수공사(습식방수)). 지명원(2025-10-14) 포트폴리오에 실제로 수록된 시공사진입니다.', '/images/construction/unit-bathhouse/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/unit-bathhouse/0.jpg', null, false, 0
from public.projects where slug = 'unit-bathhouse'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/unit-bathhouse/1.jpg', null, false, 1
from public.projects where slug = 'unit-bathhouse'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/unit-bathhouse/2.jpg', null, false, 2
from public.projects where slug = 'unit-bathhouse'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/unit-bathhouse/3.jpg', null, false, 3
from public.projects where slug = 'unit-bathhouse'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/unit-bathhouse/4.jpg', null, false, 4
from public.projects where slug = 'unit-bathhouse'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/unit-bathhouse/5.jpg', null, false, 5
from public.projects where slug = 'unit-bathhouse'
on conflict (project_id, storage_path) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'katech-proposal', '한국자동차연구원 설계제안',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '한국자동차연구원(인천)', '공공시설', '설계 제안', '2025.04',
  ARRAY['사무공간 인테리어 설계 및 시공 용역 제안서 — 시공 완료 사진 아님']::text[], '2025.04 한국자동차연구원(인천) 사무공간 인테리어 설계 및 시공 용역 제안서 — 시공 완료 사진 아님. 지명원 포트폴리오에 실린 3D 렌더링(설계 제안) 이미지이며, 실제 준공 시공사진이 아닙니다.', '/images/construction/katech-proposal/0.jpg', false, false, 'published'
on conflict (slug) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/katech-proposal/0.jpg', null, true, 0
from public.projects where slug = 'katech-proposal'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/katech-proposal/1.jpg', null, true, 1
from public.projects where slug = 'katech-proposal'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/katech-proposal/2.jpg', null, true, 2
from public.projects where slug = 'katech-proposal'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/katech-proposal/3.jpg', null, true, 3
from public.projects where slug = 'katech-proposal'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/katech-proposal/4.jpg', null, true, 4
from public.projects where slug = 'katech-proposal'
on conflict (project_id, storage_path) do nothing;
insert into public.project_images (project_id, storage_path, stage, is_render, sort_order)
select id, '/images/construction/katech-proposal/5.jpg', null, true, 5
from public.projects where slug = 'katech-proposal'
on conflict (project_id, storage_path) do nothing;

-- 4) 시공실적 - 사진 없는 텍스트 실적 173건 (지명원 4.공사실적 표, id를 slug로 사용)
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-1', '19-Y-소 공관건축보수공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '제9518부대', '군시설', '실내인테리어', '2019.03',
  ARRAY['19-Y-소 공관건축보수공사']::text[], '2019.03 제9518부대 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-2', '노틀담복지관 천정재 텍스 설치 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '재단법인 노틀담복지관', '복지시설', '신축·조성', '2019.07',
  ARRAY['노틀담복지관 천정재 텍스 설치 공사']::text[], '2019.07 재단법인 노틀담복지관 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-3', '심곡동 복어&초밥집 인테리어 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'commercial'),
  '주식회사 태인', '상가', '실내인테리어', '2019.09',
  ARRAY['심곡동 복어&초밥집 인테리어 공사']::text[], '2019.09 주식회사 태인 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-4', '청라서진프라자 노인주간보호센터 인테리어 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '초원주간노인보호센터', '복지시설', '실내인테리어', '2019.10',
  ARRAY['청라서진프라자 노인주간보호센터 인테리어 공사']::text[], '2019.10 초원주간노인보호센터 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-5', '심곡동 복어&초밥집 인테리어 추가공사의건 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'commercial'),
  '주식회사 태인', '상가', '실내인테리어', '2019.10',
  ARRAY['심곡동 복어&초밥집 인테리어 추가공사의건 공사']::text[], '2019.10 주식회사 태인 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-6', '인천항 의료관광홍보관 설치 용역',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천관광공사', '공공시설', '신축·조성', '2020.06',
  ARRAY['인천항 의료관광홍보관 설치 용역']::text[], '2020.06 인천관광공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-7', '생활관 B동 고층부 객실 내부 도배 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인천글로벌캠퍼스운영재단', '학교', '실내인테리어', '2020.07',
  ARRAY['생활관 B동 고층부 객실 내부 도배 공사']::text[], '2020.07 인천글로벌캠퍼스운영재단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-8', '인천가족공원 별빛당 실내환경 개선공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '실내인테리어', '2020.08',
  ARRAY['인천가족공원 별빛당 실내환경 개선공사']::text[], '2020.08 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-9', '광양프론티어 복층공사 및 내부인테리어공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'commercial'),
  '공인모법학원', '상가', '실내인테리어', '2020.08',
  ARRAY['광양프론티어 복층공사 및 내부인테리어공사']::text[], '2020.08 공인모법학원 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-10', '캠퍼스 결로손상 마감재 보수공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인천글로벌캠퍼스운영재단', '학교', '실내인테리어', '2020.09',
  ARRAY['캠퍼스 결로손상 마감재 보수공사']::text[], '2020.09 인천글로벌캠퍼스운영재단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-11', '부평 종합재가센터 사무실 인테리어 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '재단법인 인천복지재단', '복지시설', '실내인테리어', '2020.11',
  ARRAY['부평 종합재가센터 사무실 인테리어 공사']::text[], '2020.11 재단법인 인천복지재단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-12', '삼산월드체육관 복도 내장재 교체공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '실내인테리어', '2020.11',
  ARRAY['삼산월드체육관 복도 내장재 교체공사']::text[], '2020.11 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-13', '환풍기 및 파봉기 하부도어 설치 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천환경공단송도사업소', '공공시설', '신축·조성', '2020.12',
  ARRAY['환풍기 및 파봉기 하부도어 설치 공사']::text[], '2020.12 인천환경공단송도사업소 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-14', '인천광역시 피해장애인쉼터 인테리어 공사 계약',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '재단법인 인천복지재단', '복지시설', '실내인테리어', '2020.12',
  ARRAY['인천광역시 피해장애인쉼터 인테리어 공사 계약']::text[], '2020.12 재단법인 인천복지재단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-15', '캠퍼스 내유리 및 타일 보수공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인천글로벌캠퍼스운영재단', '학교', '실내인테리어', '2021.01',
  ARRAY['캠퍼스 내유리 및 타일 보수공사']::text[], '2021.01 인천글로벌캠퍼스운영재단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-16', '중부청 광역산업안전감독과 및 코로나19TF팀 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '중부지방고용노동청', '공공시설', '실내인테리어', '2021.02',
  ARRAY['중부청 광역산업안전감독과 및 코로나19TF팀 공사']::text[], '2021.02 중부지방고용노동청 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-17', '119구조대(관교119안전센터) 무석면 시공공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '인천미추홀소방서', '군시설', '실내인테리어', '2021.03',
  ARRAY['119구조대(관교119안전센터) 무석면 시공공사']::text[], '2021.03 인천미추홀소방서 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-18', '검암보상 대기사무소 인테리어 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'urban-corp'),
  '인천도시공사', '공공시설', '실내인테리어', '2021.03',
  ARRAY['검암보상 대기사무소 인테리어 공사']::text[], '2021.03 인천도시공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-19', '갈산그린빌, 심곡해드림, 금곡해드림 논슬립 및 장애인 핸드레일',
  (select id from public.project_categories where kind = 'construction' and slug = 'urban-corp'),
  '인천도시공사', '공공시설', '실내인테리어', '2021.04',
  ARRAY['갈산그린빌, 심곡해드림, 금곡해드림 논슬립 및 장애인 핸드레일']::text[], '2021.04 인천도시공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-20', '연희동 행정복지센터 화장실 리모델링공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천서구 연희동 행정복지센터', '공공시설', '리모델링', '2021.04',
  ARRAY['연희동 행정복지센터 화장실 리모델링공사']::text[], '2021.04 인천서구 연희동 행정복지센터 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-21', '아이사랑꿈터 서구2호점 리모델링 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '인천광역시 서구', '복지시설', '리모델링', '2021.04',
  ARRAY['아이사랑꿈터 서구2호점 리모델링 공사']::text[], '2021.04 인천광역시 서구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-22', '2021년도 심신안정실 설치 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '인천광역시 서구소방서', '군시설', '신축·조성', '2021.05',
  ARRAY['2021년도 심신안정실 설치 공사']::text[], '2021.05 인천광역시 서구소방서 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-23', '국공립가좌3동하나어린이집 환경개선 공사(건축)',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '인천광역시 서구', '복지시설', '실내인테리어', '2021.05',
  ARRAY['국공립가좌3동하나어린이집 환경개선 공사(건축)']::text[], '2021.05 인천광역시 서구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-24', '안양고용센터 2~4층 재배치 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '중부지방고용노동청안양지청', '공공시설', '실내인테리어', '2021.06',
  ARRAY['안양고용센터 2~4층 재배치 공사']::text[], '2021.06 중부지방고용노동청안양지청 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-25', '신청사건립추진단 신설에 따른 리모델링 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 미추홀구', '공공시설', '리모델링', '2021.06',
  ARRAY['신청사건립추진단 신설에 따른 리모델링 공사']::text[], '2021.06 인천광역시 미추홀구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-26', '지원센터동 체육관 내부 벽체 보수공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인천글로벌캠퍼스 재단법인', '학교', '실내인테리어', '2021.07',
  ARRAY['지원센터동 체육관 내부 벽체 보수공사']::text[], '2021.07 인천글로벌캠퍼스 재단법인 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-27', '송도컨벤시아 1전시장 주최자사무실 인테리어 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천관광공사', '공공시설', '실내인테리어', '2021.07',
  ARRAY['송도컨벤시아 1전시장 주최자사무실 인테리어 공사']::text[], '2021.07 인천관광공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-28', '화장실 보수공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '인천광역시 계양소방서', '군시설', '실내인테리어', '2021.07',
  ARRAY['화장실 보수공사']::text[], '2021.07 인천광역시 계양소방서 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-29', '세무1,2과 사무실 발코니 환경개선공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 서구', '공공시설', '실내인테리어', '2021.08',
  ARRAY['세무1,2과 사무실 발코니 환경개선공사']::text[], '2021.08 인천광역시 서구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-30', '다함께돌봄센터 4호점 리모델링 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '인천광역시 서구', '복지시설', '리모델링', '2021.08',
  ARRAY['다함께돌봄센터 4호점 리모델링 공사']::text[], '2021.08 인천광역시 서구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-31', '미디어파크 조성공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 미추홀구', '공공시설', '신축·조성', '2021.10',
  ARRAY['미디어파크 조성공사']::text[], '2021.10 인천광역시 미추홀구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-32', '신현원창동 주민자치센터 공간구조개선 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 서구', '공공시설', '실내인테리어', '2021.11',
  ARRAY['신현원창동 주민자치센터 공간구조개선 공사']::text[], '2021.11 인천광역시 서구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-33', '특공대 복지관동 내부시설 개선공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '중부지방해양경찰청', '군시설', '실내인테리어', '2021.11',
  ARRAY['특공대 복지관동 내부시설 개선공사']::text[], '2021.11 중부지방해양경찰청 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-34', '연희동 행정복지센터2층 북카페 리모델링 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천서구 연희동 행정복지센터', '공공시설', '리모델링', '2021.11',
  ARRAY['연희동 행정복지센터2층 북카페 리모델링 공사']::text[], '2021.11 인천서구 연희동 행정복지센터 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-35', '인천고용센터 남녀휴게실 신설 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '중부지방고용노동청', '공공시설', '신축·조성', '2021.11',
  ARRAY['인천고용센터 남녀휴게실 신설 공사']::text[], '2021.11 중부지방고용노동청 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-36', '인천해경서 직원숙소 시설보수 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '인천해양경찰서', '군시설', '실내인테리어', '2021.12',
  ARRAY['인천해경서 직원숙소 시설보수 공사']::text[], '2021.12 인천해양경찰서 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-37', '새아침공원 생태교육관 옥상전면부 개선공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '실내인테리어', '2021.11',
  ARRAY['새아침공원 생태교육관 옥상전면부 개선공사']::text[], '2021.11 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-38', '중봉지하차도 신축이음 유도배수판 제작 및 설치',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '신축·조성', '2021.11',
  ARRAY['중봉지하차도 신축이음 유도배수판 제작 및 설치']::text[], '2021.11 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-39', '인천서부고용복지+센터 금속 구조물 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '중부지방고용노동청 인천북부', '공공시설', '실내인테리어', '2021.11',
  ARRAY['인천서부고용복지+센터 금속 구조물 공사']::text[], '2021.11 중부지방고용노동청 인천북부 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-40', '인천금융고 실험,실습실 현대화사업 시설공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인천교육청 인천금융고등학교', '학교', '실내인테리어', '2022.01',
  ARRAY['인천금융고 실험,실습실 현대화사업 시설공사']::text[], '2022.01 인천교육청 인천금융고등학교 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-41', '약제팀 및 주사실 리모델링 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'hospital'),
  '인천적십자병원', '병원', '리모델링', '2022.03',
  ARRAY['약제팀 및 주사실 리모델링 공사']::text[], '2022.03 인천적십자병원 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-42', '가좌3동 사무실 환경개선공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '가좌3동 행정복지센터', '공공시설', '실내인테리어', '2022.03',
  ARRAY['가좌3동 사무실 환경개선공사']::text[], '2022.03 가좌3동 행정복지센터 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-43', '국공립검단양우내안애어린이집 리모델링 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '인천광역시 서구', '복지시설', '리모델링', '2022.03',
  ARRAY['국공립검단양우내안애어린이집 리모델링 공사']::text[], '2022.03 인천광역시 서구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-44', '인천시 일자리종합센터 업무 환경 개선 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천테크노파크', '공공시설', '실내인테리어', '2022.04',
  ARRAY['인천시 일자리종합센터 업무 환경 개선 공사']::text[], '2022.04 인천테크노파크 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-45', '항공단 항공보급지원대 사무공간 신설공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '해양경찰청 중부지방해양경찰청', '군시설', '신축·조성', '2022.06',
  ARRAY['항공단 항공보급지원대 사무공간 신설공사']::text[], '2022.06 해양경찰청 중부지방해양경찰청 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-46', '2022년 연수종합사회복지관 상담센터 방음벽공사 공개입',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '연수종합사회복지관', '복지시설', '실내인테리어', '2022.06',
  ARRAY['2022년 연수종합사회복지관 상담센터 방음벽공사 공개입']::text[], '2022.06 연수종합사회복지관 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-47', '유치원 실내외 놀이나눔터 환경조성 공사 계약',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인천해원초등학교', '학교', '신축·조성', '2022.08',
  ARRAY['유치원 실내외 놀이나눔터 환경조성 공사 계약']::text[], '2022.08 인천해원초등학교 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-48', '2022년 하절기 생활관 객실 내 블라인드 및 도배지',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인천글로벌캠퍼스운영재단', '학교', '실내인테리어', '2022.08',
  ARRAY['2022년 하절기 생활관 객실 내 블라인드 및 도배지']::text[], '2022.08 인천글로벌캠퍼스운영재단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-49', '아시아드주경기장 스포츠산업창업지원실 조성공사(건축)',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '신축·조성', '2022.08',
  ARRAY['아시아드주경기장 스포츠산업창업지원실 조성공사(건축)']::text[], '2022.08 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-50', '소망요양병원 2층 건강검진센터 리모델링공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'hospital'),
  '소망요양병원', '병원', '리모델링', '2022.08',
  ARRAY['소망요양병원 2층 건강검진센터 리모델링공사']::text[], '2022.08 소망요양병원 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-51', '남부인지건강센터 인테리어 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 강화군 보건소', '공공시설', '실내인테리어', '2022.09',
  ARRAY['남부인지건강센터 인테리어 공사']::text[], '2022.09 인천광역시 강화군 보건소 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-52', '강화도 집수리지원사업 창호공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 강화군', '공공시설', '실내인테리어', '2022.09',
  ARRAY['강화도 집수리지원사업 창호공사']::text[], '2022.09 인천광역시 강화군 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-53', '화개정원 임시매표소 주변 정비공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시 강화군 정원관리사업소', '공공시설', '실내인테리어', '2022.10',
  ARRAY['화개정원 임시매표소 주변 정비공사']::text[], '2022.10 인천시 강화군 정원관리사업소 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-54', '연희동 행정복지센터 지하1층 공유주방공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 서구 연희동', '공공시설', '실내인테리어', '2022.10',
  ARRAY['연희동 행정복지센터 지하1층 공유주방공사']::text[], '2022.10 인천광역시 서구 연희동 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-55', '미추홀구 다함께돌봄센터 4,5호점 리모델링 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '인천광역시 미추홀구', '복지시설', '리모델링', '2022.10',
  ARRAY['미추홀구 다함께돌봄센터 4,5호점 리모델링 공사']::text[], '2022.10 인천광역시 미추홀구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-56', '강화군 행복센터 직원휴게실 등 개선공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 강화군', '공공시설', '실내인테리어', '2022.10',
  ARRAY['강화군 행복센터 직원휴게실 등 개선공사']::text[], '2022.10 인천광역시 강화군 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-57', '회의실 조성을 위한 인테리어 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '국민통합위원회', '공공시설', '신축·조성', '2022.10',
  ARRAY['회의실 조성을 위한 인테리어 공사']::text[], '2022.10 국민통합위원회 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-58', '자월면 청사 흡음텍스 설치 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천 옹진군 자월면', '공공시설', '신축·조성', '2022.11',
  ARRAY['자월면 청사 흡음텍스 설치 공사']::text[], '2022.11 인천 옹진군 자월면 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-59', '다함께돌봄센터 6호점 리모델링 공사(건축)',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '인천광역시 서구', '복지시설', '리모델링', '2022.11',
  ARRAY['다함께돌봄센터 6호점 리모델링 공사(건축)']::text[], '2022.11 인천광역시 서구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-60', '검단출장소 직원 샤워실 조성 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 서구 검단출장소', '공공시설', '신축·조성', '2022.11',
  ARRAY['검단출장소 직원 샤워실 조성 공사']::text[], '2022.11 인천광역시 서구 검단출장소 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-61', '덕적고 야구부 실내연습장 시공',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인천시교육청 덕적고등학교', '학교', '실내인테리어', '2022.12',
  ARRAY['덕적고 야구부 실내연습장 시공']::text[], '2022.12 인천시교육청 덕적고등학교 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-62', '미추홀타워 옥외광고물 구매 설치 사업(제작 및 설치) 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천테크노파크', '공공시설', '신축·조성', '2022.04',
  ARRAY['미추홀타워 옥외광고물 구매 설치 사업(제작 및 설치) 공사']::text[], '2022.04 인천테크노파크 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-63', '숭의2동 행정복지센터 금속창호 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 미추홀구', '공공시설', '실내인테리어', '2022.05',
  ARRAY['숭의2동 행정복지센터 금속창호 공사']::text[], '2022.05 인천광역시 미추홀구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-64', '서울북부업무상질병판정위원회 금속공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '근로복지공단', '공공시설', '실내인테리어', '2022.05',
  ARRAY['서울북부업무상질병판정위원회 금속공사']::text[], '2022.05 근로복지공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-65', '강화소창기념품전시관 그늘막 설치공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 강화군', '공공시설', '신축·조성', '2022.07',
  ARRAY['강화소창기념품전시관 그늘막 설치공사']::text[], '2022.07 인천광역시 강화군 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-66', '휴게공간 데크공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'commercial'),
  '(주)대원종합이엔지', '상가', '실내인테리어', '2022.10',
  ARRAY['휴게공간 데크공사']::text[], '2022.10 (주)대원종합이엔지 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-67', '청라호수공원 제 2,3주차장 높이제한',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '실내인테리어', '2022.11',
  ARRAY['청라호수공원 제 2,3주차장 높이제한']::text[], '2022.11 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-68', '아이사랑꿈터(강화군 1호점) 그래픽 및 로고 설치공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '인천광역시 강화군', '복지시설', '신축·조성', '2022.12',
  ARRAY['아이사랑꿈터(강화군 1호점) 그래픽 및 로고 설치공사']::text[], '2022.12 인천광역시 강화군 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-69', '화개정원 조형물 포토존 설치사업',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시 강화군 정원관리사업소', '공공시설', '신축·조성', '2022.12',
  ARRAY['화개정원 조형물 포토존 설치사업']::text[], '2022.12 인천시 강화군 정원관리사업소 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-70', '아시아드주경기장 1,4게이트 휀스형 출입문 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '실내인테리어', '2023.02',
  ARRAY['아시아드주경기장 1,4게이트 휀스형 출입문 공사']::text[], '2023.02 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-71', '동광직물 생활문화센터 싸인 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 강화군', '공공시설', '실내인테리어', '2023.03',
  ARRAY['동광직물 생활문화센터 싸인 공사']::text[], '2023.03 인천광역시 강화군 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-72', '검단동 행정복지센터 민원대 가림막 설치',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 검단동', '공공시설', '신축·조성', '2023.03',
  ARRAY['검단동 행정복지센터 민원대 가림막 설치']::text[], '2023.03 인천광역시 검단동 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-73', '인천고용센터 5층 및 6층 창문, 새시 교체공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '중부지방고용노동청', '공공시설', '실내인테리어', '2023.04',
  ARRAY['인천고용센터 5층 및 6층 창문, 새시 교체공사']::text[], '2023.04 중부지방고용노동청 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-74', '인천발전소 장치 SHOP 상부 지붕 보수공사 용역',
  (select id from public.project_categories where kind = 'construction' and slug = 'commercial'),
  '(주)포스코인터내셔널', '상가', '실내인테리어', '2023.05',
  ARRAY['인천발전소 장치 SHOP 상부 지붕 보수공사 용역']::text[], '2023.05 (주)포스코인터내셔널 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-75', '부평역사박물관 외관공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 부평역사박물관', '공공시설', '실내인테리어', '2023.08',
  ARRAY['부평역사박물관 외관공사']::text[], '2023.08 인천광역시 부평역사박물관 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-76', '영종 옥상방수 및 지붕판넬 교체공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천환경공단', '공공시설', '실내인테리어', '2023.08',
  ARRAY['영종 옥상방수 및 지붕판넬 교체공사']::text[], '2023.08 인천환경공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-77', '인천고용센터 3층 및 4층 창문, 새시 교체 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천고용복지센터', '공공시설', '실내인테리어', '2023.09',
  ARRAY['인천고용센터 3층 및 4층 창문, 새시 교체 공사']::text[], '2023.09 인천고용복지센터 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-78', '다사랑의집 옥상방수 및 보수공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '다사랑의집', '복지시설', '실내인테리어', '2023.10',
  ARRAY['다사랑의집 옥상방수 및 보수공사']::text[], '2023.10 다사랑의집 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-79', '인천고용센터 1층 및 2층 창문, 새시 교체 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '중부지방고용노동청 평택지청', '공공시설', '실내인테리어', '2023.10',
  ARRAY['인천고용센터 1층 및 2층 창문, 새시 교체 공사']::text[], '2023.10 중부지방고용노동청 평택지청 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-80', '봉천동아 203동 복도 창호 부분설치공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'urban-corp'),
  '서울주택도시공사', '공공시설', '신축·조성', '2023.10',
  ARRAY['봉천동아 203동 복도 창호 부분설치공사']::text[], '2023.10 서울주택도시공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-81', 'SK북한산시티 148동 복도 새시 부분 설치공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'urban-corp'),
  '서울주택도시공사', '공공시설', '신축·조성', '2023.11',
  ARRAY['SK북한산시티 148동 복도 새시 부분 설치공사']::text[], '2023.11 서울주택도시공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-82', '서구 사회적경제마을지원센터 코워킹룸 리모델링 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '서구청', '공공시설', '리모델링', '2023.02',
  ARRAY['서구 사회적경제마을지원센터 코워킹룸 리모델링 공사']::text[], '2023.02 서구청 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-83', '인하부고 본관 노후 환경개선공사 (건축)',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인하대사범대학부속고등학교', '학교', '실내인테리어', '2023.02',
  ARRAY['인하부고 본관 노후 환경개선공사 (건축)']::text[], '2023.02 인하대사범대학부속고등학교 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-84', '미아벽산 경비실 시설물 보수공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'urban-corp'),
  '서울주택도시공사', '공공시설', '실내인테리어', '2023.03',
  ARRAY['미아벽산 경비실 시설물 보수공사']::text[], '2023.03 서울주택도시공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-85', '고정익정비대 사무공간 개선 실내건축 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '중부지방해양경찰청', '군시설', '실내인테리어', '2023.04',
  ARRAY['고정익정비대 사무공간 개선 실내건축 공사']::text[], '2023.04 중부지방해양경찰청 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-86', '도시재생지원센터 인테리어공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'urban-corp'),
  '인천도시공사', '공공시설', '실내인테리어', '2023.04',
  ARRAY['도시재생지원센터 인테리어공사']::text[], '2023.04 인천도시공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-87', '공중화장실 리모델링 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 미추홀구', '공공시설', '리모델링', '2023.04',
  ARRAY['공중화장실 리모델링 공사']::text[], '2023.04 인천광역시 미추홀구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-88', '다사랑의집 창호 및 장판교체공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '다사랑의집', '복지시설', '실내인테리어', '2023.04',
  ARRAY['다사랑의집 창호 및 장판교체공사']::text[], '2023.04 다사랑의집 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-89', '청년센터 서구1939 부분리모델링 공사(건축)',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 서구', '공공시설', '리모델링', '2023.05',
  ARRAY['청년센터 서구1939 부분리모델링 공사(건축)']::text[], '2023.05 인천광역시 서구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-90', '가정1동 임시주민자치센터 철거 및 원상복구공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '가정1동 임시주민자치센터', '공공시설', '실내인테리어', '2023.05',
  ARRAY['가정1동 임시주민자치센터 철거 및 원상복구공사']::text[], '2023.05 가정1동 임시주민자치센터 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-91', '인천성산감리교회 교육관 화장실 리모델링 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'commercial'),
  '인천성산감리교회', '상가', '리모델링', '2023.06',
  ARRAY['인천성산감리교회 교육관 화장실 리모델링 공사']::text[], '2023.06 인천성산감리교회 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-92', '가재울 공유부엌공간 신설공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 서구 가좌4동', '공공시설', '신축·조성', '2023.06',
  ARRAY['가재울 공유부엌공간 신설공사']::text[], '2023.06 인천광역시 서구 가좌4동 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-93', '가드너교육센터 단열필름 설치공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '신축·조성', '2023.06',
  ARRAY['가드너교육센터 단열필름 설치공사']::text[], '2023.06 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-94', '구내식당 리모델링 공사(건축)',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 서구', '공공시설', '리모델링', '2023.07',
  ARRAY['구내식당 리모델링 공사(건축)']::text[], '2023.07 인천광역시 서구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-95', '인천 블록체인 허브센터 조성 공사 용역',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천테크노파크', '공공시설', '신축·조성', '2023.07',
  ARRAY['인천 블록체인 허브센터 조성 공사 용역']::text[], '2023.07 인천테크노파크 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-96', '상월곡동아 외 3개단지 공가 17세대 도배 및 장판 교체',
  (select id from public.project_categories where kind = 'construction' and slug = 'urban-corp'),
  '서울주택도시공사', '공공시설', '실내인테리어', '2023.08',
  ARRAY['상월곡동아 외 3개단지 공가 17세대 도배 및 장판 교체']::text[], '2023.08 서울주택도시공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-97', '민원실 환경개선공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 서구 석남3동', '공공시설', '실내인테리어', '2023.08',
  ARRAY['민원실 환경개선공사']::text[], '2023.08 인천광역시 서구 석남3동 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-98', '평택지청 평택고용센터 통합네트워크 인테리어공사 설계용역',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '중부지방고용노동청 평택지청', '공공시설', '설계 제안', '2023.09',
  ARRAY['평택지청 평택고용센터 통합네트워크 인테리어공사 설계용역']::text[], '2023.09 중부지방고용노동청 평택지청 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-99', '사용적합성평가센터 구축 인테리어 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천테크노파크', '공공시설', '신축·조성', '2023.10',
  ARRAY['사용적합성평가센터 구축 인테리어 공사']::text[], '2023.10 인천테크노파크 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-100', '아이사랑꿈터7호점 리모델링 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '미추홀구', '복지시설', '리모델링', '2023.10',
  ARRAY['아이사랑꿈터7호점 리모델링 공사']::text[], '2023.10 미추홀구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-101', '전시2홀 주최자 사무실 인테리어 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천관광공사', '공공시설', '실내인테리어', '2023.11',
  ARRAY['전시2홀 주최자 사무실 인테리어 공사']::text[], '2023.11 인천관광공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-102', '7층 교과교실 구축 인테리어 공사 계약 체결',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인천전자마이스터고등학교', '학교', '신축·조성', '2023.12',
  ARRAY['7층 교과교실 구축 인테리어 공사 계약 체결']::text[], '2023.12 인천전자마이스터고등학교 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-103', '문학정보고등학교 실험실습실 공간혁신 및 재구조화 사업',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '문학정보고등학교', '학교', '실내인테리어', '2023.12',
  ARRAY['문학정보고등학교 실험실습실 공간혁신 및 재구조화 사업']::text[], '2023.12 문학정보고등학교 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-104', '동소문한진 301동 비상계단 및 승강기홀 새시 교체공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'urban-corp'),
  '서울주택도시공사', '공공시설', '실내인테리어', '2024.02',
  ARRAY['동소문한진 301동 비상계단 및 승강기홀 새시 교체공사']::text[], '2024.02 서울주택도시공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-105', '봉천두산 단지외곽 휀스 교체공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'urban-corp'),
  '서울주택도시공사', '공공시설', '실내인테리어', '2024.02',
  ARRAY['봉천두산 단지외곽 휀스 교체공사']::text[], '2024.02 서울주택도시공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-106', '송도공원 높이제한시설 제작설치',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '신축·조성', '2024.03',
  ARRAY['송도공원 높이제한시설 제작설치']::text[], '2024.03 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-107', '24-덕 00기지 냉동창고 교체공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '해군2함대사령부', '군시설', '실내인테리어', '2024.03',
  ARRAY['24-덕 00기지 냉동창고 교체공사']::text[], '2024.03 해군2함대사령부 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-108', '장밋빛팝업가든 조성을위한 포토존제작설치',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '신축·조성', '2024.05',
  ARRAY['장밋빛팝업가든 조성을위한 포토존제작설치']::text[], '2024.05 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-109', '2024학년도 옥상텃밭 휀스 및 음식물쓰레기 감량기 하우징 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인천단봉초등학교', '학교', '실내인테리어', '2024.07',
  ARRAY['2024학년도 옥상텃밭 휀스 및 음식물쓰레기 감량기 하우징 공사']::text[], '2024.07 인천단봉초등학교 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-110', '"나" 지역지역 더 좋은병영식당 개선공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '제5378부대', '군시설', '실내인테리어', '2024.08',
  ARRAY['"나" 지역지역 더 좋은병영식당 개선공사']::text[], '2024.08 제5378부대 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-111', '평택지청 신축청사 인테리어 금속공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '중부지방고용노동청', '공공시설', '실내인테리어', '2024.08',
  ARRAY['평택지청 신축청사 인테리어 금속공사']::text[], '2024.08 중부지방고용노동청 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-112', '가림고등학교 정류장 주변 통행로 구축 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인천광역시 서구', '학교', '신축·조성', '2024.08',
  ARRAY['가림고등학교 정류장 주변 통행로 구축 공사']::text[], '2024.08 인천광역시 서구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-113', '부천지청 별관 금속공사 외',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '중부지방고용노동청 부천지청', '공공시설', '실내인테리어', '2024.09',
  ARRAY['부천지청 별관 금속공사 외']::text[], '2024.09 중부지방고용노동청 부천지청 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-114', '대공원팀 공원안내소 시설물 보수공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '실내인테리어', '2024.11',
  ARRAY['대공원팀 공원안내소 시설물 보수공사']::text[], '2024.11 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-115', '중봉지하차도 유도배수판 설치',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '신축·조성', '2024.12',
  ARRAY['중봉지하차도 유도배수판 설치']::text[], '2024.12 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-116', '1·3공동구 배수유도 설치공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '신축·조성', '2024.12',
  ARRAY['1·3공동구 배수유도 설치공사']::text[], '2024.12 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-117', '연희동 동청사 지하층 리모델링 공사(기계)',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '연희동행정복지센터', '공공시설', '리모델링', '2024.01',
  ARRAY['연희동 동청사 지하층 리모델링 공사(기계)']::text[], '2024.01 연희동행정복지센터 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-118', '왕길동 쓰레기선별장 직원휴게실 바닥전기 난방공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 서구', '공공시설', '실내인테리어', '2024.01',
  ARRAY['왕길동 쓰레기선별장 직원휴게실 바닥전기 난방공사']::text[], '2024.01 인천광역시 서구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-119', '대보수17)정무관 보수공사(기계)',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '제17보병사단', '군시설', '실내인테리어', '2024.07',
  ARRAY['대보수17)정무관 보수공사(기계)']::text[], '2024.07 제17보병사단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-120', '검암경서동 행정복지센터 리모델링 공사(기계)',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 서구 검암경서동', '공공시설', '리모델링', '2024.07',
  ARRAY['검암경서동 행정복지센터 리모델링 공사(기계)']::text[], '2024.07 인천광역시 서구 검암경서동 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-121', '대공원팀 냉난방기 이전설치 및 전기공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '신축·조성', '2024.08',
  ARRAY['대공원팀 냉난방기 이전설치 및 전기공사']::text[], '2024.08 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-122', '서동이어린이집 리모델링 공사(기계)',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '인천광역시 서구', '복지시설', '리모델링', '2024.09',
  ARRAY['서동이어린이집 리모델링 공사(기계)']::text[], '2024.09 인천광역시 서구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-123', '송파파인타운 803동 1405호 외 46세대 창틀 누수 보수공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'urban-corp'),
  '서울주택도시공사', '공공시설', '실내인테리어', '2024.01',
  ARRAY['송파파인타운 803동 1405호 외 46세대 창틀 누수 보수공사']::text[], '2024.01 서울주택도시공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-124', '24-볼-화장실 개선공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '해군인천해역방어사령부', '군시설', '실내인테리어', '2024.05',
  ARRAY['24-볼-화장실 개선공사']::text[], '2024.05 해군인천해역방어사령부 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-125', '인천고용센터 지상1층(화단), 지하1층(주차장) 방수 및 덕트공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '중부지방고용노동청', '공공시설', '실내인테리어', '2024.07',
  ARRAY['인천고용센터 지상1층(화단), 지하1층(주차장) 방수 및 덕트공사']::text[], '2024.07 중부지방고용노동청 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-126', '위임48)00부대 목욕탕 보수공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '제17보병사단', '군시설', '실내인테리어', '2024.08',
  ARRAY['위임48)00부대 목욕탕 보수공사']::text[], '2024.08 제17보병사단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-127', '의정부지청 옥상 방수 보수 작업',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '중부지방고용노동청 의정부', '공공시설', '실내인테리어', '2024.11',
  ARRAY['의정부지청 옥상 방수 보수 작업']::text[], '2024.11 중부지방고용노동청 의정부 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-128', '인천아라고등학교 미래교실 및 AI교실 구축공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인천아라고등학교', '학교', '신축·조성', '2024.02',
  ARRAY['인천아라고등학교 미래교실 및 AI교실 구축공사']::text[], '2024.02 인천아라고등학교 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-129', '송파헬리오시티 (407동 1106호 외 17세대) 시설물 보수공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'urban-corp'),
  '서울주택도시공사', '공공시설', '실내인테리어', '2024.02',
  ARRAY['송파헬리오시티 (407동 1106호 외 17세대) 시설물 보수공사']::text[], '2024.02 서울주택도시공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-130', '주차사업부 신규 주사무실 인테리어 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천서구시설관리공단', '공공시설', '실내인테리어', '2024.03',
  ARRAY['주차사업부 신규 주사무실 인테리어 공사']::text[], '2024.03 인천서구시설관리공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-131', '용현3동 행정복지센터 임시청사 리모델링 공사(건축)',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시 미추홀구 용현3동', '공공시설', '리모델링', '2024.03',
  ARRAY['용현3동 행정복지센터 임시청사 리모델링 공사(건축)']::text[], '2024.03 인천시 미추홀구 용현3동 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-132', '인천서구복지재단 사무실공사(건축)',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '인천광역시 서구', '복지시설', '실내인테리어', '2024.04',
  ARRAY['인천서구복지재단 사무실공사(건축)']::text[], '2024.04 인천광역시 서구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-133', '대야동 방범초소 설치공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '시흥시 자율방범총대', '공공시설', '신축·조성', '2024.04',
  ARRAY['대야동 방범초소 설치공사']::text[], '2024.04 시흥시 자율방범총대 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-134', '청라3동 주민자치실 리모델링 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 서구', '공공시설', '리모델링', '2024.05',
  ARRAY['청라3동 주민자치실 리모델링 공사']::text[], '2024.05 인천광역시 서구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-135', '구립 경로당 5개소(고현, 가정1동, 가정3동, 신현분회, 심덕) 개보수 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '인천광역시 서구', '복지시설', '실내인테리어', '2024.06',
  ARRAY['구립 경로당 5개소(고현, 가정1동, 가정3동, 신현분회, 심덕) 개보수 공사']::text[], '2024.06 인천광역시 서구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-136', '24년 수선유지급여사업(대보수) 개보수공사(인천2권역)',
  (select id from public.project_categories where kind = 'construction' and slug = 'lh'),
  '한국토지주택공사', '공공시설', '실내인테리어', '2024.06',
  ARRAY['24년 수선유지급여사업(대보수) 개보수공사(인천2권역)']::text[], '2024.06 한국토지주택공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-137', '아이사랑꿈터 미추홀구 8호점 리모델링 공사(건축)',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '인천광역시 미추홀구', '복지시설', '리모델링', '2024.06',
  ARRAY['아이사랑꿈터 미추홀구 8호점 리모델링 공사(건축)']::text[], '2024.06 인천광역시 미추홀구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-138', '주거대17)영종스카이빌 아파트 보수공사(건축)',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '제17보병사단', '군시설', '실내인테리어', '2024.07',
  ARRAY['주거대17)영종스카이빌 아파트 보수공사(건축)']::text[], '2024.07 제17보병사단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-139', '가톨릭대학교 성심관 지하 강의실 환경개선 건축 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '가톨릭대학교 성심교정', '학교', '실내인테리어', '2024.08',
  ARRAY['가톨릭대학교 성심관 지하 강의실 환경개선 건축 공사']::text[], '2024.08 가톨릭대학교 성심교정 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-140', '학생안전부 학생분리지도실 구축 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인평자동차고등학교', '학교', '신축·조성', '2024.10',
  ARRAY['학생안전부 학생분리지도실 구축 공사']::text[], '2024.10 인평자동차고등학교 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-141', '검단도서관 바닥타일 교체공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천서구시설관리공단', '공공시설', '실내인테리어', '2024.11',
  ARRAY['검단도서관 바닥타일 교체공사']::text[], '2024.11 인천서구시설관리공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-142', '상상플랫폼 핸드프린팅 전시공간 조성 공사(건축)',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천관광공사', '공공시설', '신축·조성', '2024.11',
  ARRAY['상상플랫폼 핸드프린팅 전시공간 조성 공사(건축)']::text[], '2024.11 인천관광공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-143', '성호푸드 바닥 및 판넬공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'commercial'),
  '성호푸드', '상가', '실내인테리어', '2024.11',
  ARRAY['성호푸드 바닥 및 판넬공사']::text[], '2024.11 성호푸드 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-144', '평생학습관 장애인편의시설 설치공사(건축)',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시 미추홀구 평생학습관', '공공시설', '신축·조성', '2025.02',
  ARRAY['평생학습관 장애인편의시설 설치공사(건축)']::text[], '2025.02 인천시 미추홀구 평생학습관 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-145', '본서 노후 화장실 환경개선 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '인천공단소방서', '군시설', '실내인테리어', '2025.03',
  ARRAY['본서 노후 화장실 환경개선 공사']::text[], '2025.03 인천공단소방서 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-146', '계산국민체육센터 마루교체공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '실내인테리어', '2025.04',
  ARRAY['계산국민체육센터 마루교체공사']::text[], '2025.04 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-147', '2025년 체험관 항공안전 체험시설 보강 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천국민안전체험관', '공공시설', '실내인테리어', '2025.05',
  ARRAY['2025년 체험관 항공안전 체험시설 보강 공사']::text[], '2025.05 인천국민안전체험관 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-148', '25년 수선유지급여사업(대보수) 개보수공사(인천1권역)',
  (select id from public.project_categories where kind = 'construction' and slug = 'lh'),
  '한국토지주택공사', '공공시설', '실내인테리어', '2025.06',
  ARRAY['25년 수선유지급여사업(대보수) 개보수공사(인천1권역)']::text[], '2025.06 한국토지주택공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-149', '25년 수선유지급여사업(대보수) 개보수공사(인천2권역)',
  (select id from public.project_categories where kind = 'construction' and slug = 'lh'),
  '한국토지주택공사', '공공시설', '실내인테리어', '2025.06',
  ARRAY['25년 수선유지급여사업(대보수) 개보수공사(인천2권역)']::text[], '2025.06 한국토지주택공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-150', '영O 경남, 광명아파트 화장실리모델링(시설)',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '공군제3미사일방어여단', '군시설', '리모델링', '2025.06',
  ARRAY['영O 경남, 광명아파트 화장실리모델링(시설)']::text[], '2025.06 공군제3미사일방어여단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-151', '2025년 노후 공공임대주택 리모델링사업(연수시영아파트)',
  (select id from public.project_categories where kind = 'construction' and slug = 'urban-corp'),
  '인천도시공사', '공공시설', '리모델링', '2025.07',
  ARRAY['2025년 노후 공공임대주택 리모델링사업(연수시영아파트)']::text[], '2025.07 인천도시공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-152', '신부평지하도상가 에스컬레이터 교체 부대공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '실내인테리어', '2025.01',
  ARRAY['신부평지하도상가 에스컬레이터 교체 부대공사']::text[], '2025.01 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-153', '구파발10-3단지 1026동 외 1개동 복도 창호 설치공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'urban-corp'),
  '서울주택도시공사', '공공시설', '신축·조성', '2025.01',
  ARRAY['구파발10-3단지 1026동 외 1개동 복도 창호 설치공사']::text[], '2025.01 서울주택도시공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-154', '2025년도 중구 관내 교통안전시설물 정비공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 중구', '공공시설', '실내인테리어', '2025.02',
  ARRAY['2025년도 중구 관내 교통안전시설물 정비공사']::text[], '2025.02 인천광역시 중구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-155', '구파발9-1단지 902동 외 5개소 분리수거장 교체공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'urban-corp'),
  '서울주택도시공사', '공공시설', '실내인테리어', '2025.02',
  ARRAY['구파발9-1단지 902동 외 5개소 분리수거장 교체공사']::text[], '2025.02 서울주택도시공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-156', '오류지구 체비지 펜스 설치 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 서구', '공공시설', '신축·조성', '2025.02',
  ARRAY['오류지구 체비지 펜스 설치 공사']::text[], '2025.02 인천광역시 서구 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-157', '119특수대응단 수난구조대 청사 이중창 설치공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '인천119특수대응단', '군시설', '신축·조성', '2025.04',
  ARRAY['119특수대응단 수난구조대 청사 이중창 설치공사']::text[], '2025.04 인천119특수대응단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-158', '부평역사박물관 회랑 외벽 유리 파손분 교체',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '부평역사박물관', '공공시설', '실내인테리어', '2025.04',
  ARRAY['부평역사박물관 회랑 외벽 유리 파손분 교체']::text[], '2025.04 부평역사박물관 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-159', '공촌3교 배수트랜치 정비공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '실내인테리어', '2025.05',
  ARRAY['공촌3교 배수트랜치 정비공사']::text[], '2025.05 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-160', '봉천동아 201동, 204동 옥상 안전난간대 설치공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'urban-corp'),
  '서울주택도시공사', '공공시설', '신축·조성', '2025.06',
  ARRAY['봉천동아 201동, 204동 옥상 안전난간대 설치공사']::text[], '2025.06 서울주택도시공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-161', '신부평지하도상가 28번 출입구 보수공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천시설공단', '공공시설', '실내인테리어', '2025.05',
  ARRAY['신부평지하도상가 28번 출입구 보수공사']::text[], '2025.05 인천시설공단 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-162', '수색대림 113동 외 1개동 재활용분리수거장 교체공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'urban-corp'),
  '서울주택도시공사', '공공시설', '실내인테리어', '2025.06',
  ARRAY['수색대림 113동 외 1개동 재활용분리수거장 교체공사']::text[], '2025.06 서울주택도시공사 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-163', '대곡119지역대 지붕 설치 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '인천검단소방서', '군시설', '신축·조성', '2025.06',
  ARRAY['대곡119지역대 지붕 설치 공사']::text[], '2025.06 인천검단소방서 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-164', '인천가현초등학교 옥상방수공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인천광역시서부교육지원청', '학교', '실내인테리어', '2025.01',
  ARRAY['인천가현초등학교 옥상방수공사']::text[], '2025.01 인천광역시서부교육지원청 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-165', '교과교실 보수 및 교내시설 환경개선',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인평자동차고등학교', '학교', '실내인테리어', '2025.02',
  ARRAY['교과교실 보수 및 교내시설 환경개선']::text[], '2025.02 인평자동차고등학교 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-166', '검단소방서 다목적강당 내부 도장 보강 공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'military'),
  '인천광역시 검단소방서', '군시설', '실내인테리어', '2025.06',
  ARRAY['검단소방서 다목적강당 내부 도장 보강 공사']::text[], '2025.06 인천광역시 검단소방서 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-167', '검암경서동 행정복지센터 방수 및 보수공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '검암경서동행정복지센터', '공공시설', '실내인테리어', '2025.05',
  ARRAY['검암경서동 행정복지센터 방수 및 보수공사']::text[], '2025.05 검암경서동행정복지센터 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-168', '실습동 덕트설비 철거 및 재설치',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '한국조리과학고등학교', '학교', '신축·조성', '2025.09',
  ARRAY['실습동 덕트설비 철거 및 재설치']::text[], '2025.09 한국조리과학고등학교 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-169', '상인천초 디자인이 담긴 화장실 개선 기계설비공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인천광역시동부교육지원청', '학교', '실내인테리어', '2025.12',
  ARRAY['상인천초 디자인이 담긴 화장실 개선 기계설비공사']::text[], '2025.12 인천광역시동부교육지원청 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-170', '한국조리과학고 급식실 환기시설 개선공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '한국조리과학고등학교', '학교', '실내인테리어', '2025.02',
  ARRAY['한국조리과학고 급식실 환기시설 개선공사']::text[], '2025.02 한국조리과학고등학교 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-171', '인천진산과학고등학교 창의융합동 증축 기계설비공사',
  (select id from public.project_categories where kind = 'construction' and slug = 'school'),
  '인천광역시북부교육지원청', '학교', '실내인테리어', '2025.03',
  ARRAY['인천진산과학고등학교 창의융합동 증축 기계설비공사']::text[], '2025.03 인천광역시북부교육지원청 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-172', '2층 천장형에어컨 교체 및 설치공사 계약',
  (select id from public.project_categories where kind = 'construction' and slug = 'welfare'),
  '푸른마을아동복지종합센터', '복지시설', '신축·조성', '2025.05',
  ARRAY['2층 천장형에어컨 교체 및 설치공사 계약']::text[], '2025.05 푸른마을아동복지종합센터 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;
insert into public.projects (kind, slug, title, category_id, region, building_type, project_nature, period, scope, description, thumbnail_url, is_featured, is_sample, status)
select 'construction', 'cr-173', '송도국제어린이도서관 GHP 가스열펌프(실외기) 구매',
  (select id from public.project_categories where kind = 'construction' and slug = 'public'),
  '인천광역시 연수구청', '공공시설', '실내인테리어', '2025.05',
  ARRAY['송도국제어린이도서관 GHP 가스열펌프(실외기) 구매']::text[], '2025.05 인천광역시 연수구청 발주로 진행된 시공 사례입니다. 지명원(2025-10-14) 공사실적 표에 기재되어 있으며 사진은 게재되어 있지 않습니다.', null, false, false, 'published'
on conflict (slug) do nothing;

-- 화재복구 사례(kind=fire_case)는 src/lib/data/fire-recovery-cases.ts가 현재 빈 배열이라 시드할 데이터가 없습니다.
-- 실제 사례가 생기면 scripts/generate-seed.ts를 다시 실행해 이 파일을 재생성하세요.

