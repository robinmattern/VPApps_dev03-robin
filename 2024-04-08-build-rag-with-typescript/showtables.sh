#!/bin/bash/
sqlite3 "/Users/Shared/repos/videoprojects/2024-04-08-build-rag-with-typescript/my_chroma_data/chroma.sqlite3" "SELECT ROW_NUMBER() OVER (ORDER BY name) AS num,name,tbl_name,rootpage FROM sqlitemaster WHERE type='table' AND name NOT LIKE 'sqlite%';"