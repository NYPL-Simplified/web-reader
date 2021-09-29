The AxisNow example is a real book in the NYPL Open eBooks catalog. If it 
isn't working, you may need to re-borrow it and then use a new book_vault_uuid
and isbn in your env vars.

This is the link to the OPDS entry
https://USERNAME:PASSWORD@circulation.openebooks.us/USOEI/works/Axis%20360%20ID/0018450548/

Borrow this book with this command:
curl https://USERNAME:PASSWORD@circulation.openebooks.us/USOEI/works/Axis%20360%20ID/0018450548/borrow/44

Then fulfill the book with this command to get the params:
curl https://USERNAME:PASSWORD@circulation.openebooks.us/USOEI/works/6141/fulfill/44