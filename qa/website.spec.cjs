const {test,expect}=require('@playwright/test');
for(const width of [390,1280]){
test('trial and order '+width,async({page})=>{
 await page.setViewportSize({width,height:850});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8000/v36-3.html?utm_source=qa');
 const stage=page.locator('#stage');
 await stage.getByRole('button',{name:'표현 익히기'}).click();
 await expect(page.locator('#pins')).toBeVisible();
 await stage.getByRole('button',{name:'어순 배열 시작'}).click();
 const pool=stage.locator('.unitRow');
 for(const word of ['my book.','She','took']) await pool.getByRole('button',{name:word,exact:true}).click();
 await stage.getByRole('button',{name:'확인',exact:true}).click();
 await expect(page.locator('#status')).toContainText('어순을 다시');
 await stage.getByRole('button',{name:'다시 배열'}).click();
 await expect(stage.getByRole('button',{name:'확인',exact:true})).toBeDisabled();
 for(const word of ['She','took','my book.']) await pool.getByRole('button',{name:word,exact:true}).click();
 await stage.getByRole('button',{name:'확인',exact:true}).click();
 await stage.getByRole('button',{name:'말했어요 · 정답 확인'}).click();
 await expect(page.locator('#revealedAnswer')).toHaveText('She took my book.');
 await stage.getByRole('button',{name:'체험 마치기'}).click();
 await expect(stage).toContainText('체험을 마쳤어요');
 for(const id of ['basic','complete','premium']){
 await page.locator('[data-plan="'+id+'"]').click();
 const dialog=page.getByRole('dialog');
 await expect(dialog).toBeVisible();
 await dialog.getByRole('button',{name:'테스트 주문 확인'}).click();
 await expect(dialog.getByRole('button',{name:'테스트 주문 확인'})).toBeDisabled();
 await dialog.getByRole('button',{name:'다른 과정 비교'}).click();
 }
 const events=await page.evaluate(()=>window.nuntdaReviewEvents());
 expect(events.filter(e=>e.event==='review_checkout')).toHaveLength(3);
 expect(events.some(e=>e.event==='trial_complete')).toBeTruthy();
 expect(events.some(e=>e.event==='purchase')).toBeFalsy();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
 expect(errors).toEqual([]);
});
}
