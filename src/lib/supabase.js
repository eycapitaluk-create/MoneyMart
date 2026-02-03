import { createClient } from '@supabase/supabase-js';

// 1. 사장님의 프로젝트 주소 (확인됨)
const supabaseUrl = 'https://wsvgblhrephscwmvgdzr.supabase.co';

// 2. 사장님의 공개 키 (두 번째 스크린샷의 'Publishable key'를 복사해서 넣으세요)
// 예: 'sb_publishable_2gKzHG...'
const supabaseKey = 'sb_publishable_2gKzHGYzeWD56qmYSRW8Rw_SUTc3Nwc';

export const supabase = createClient(supabaseUrl, supabaseKey);