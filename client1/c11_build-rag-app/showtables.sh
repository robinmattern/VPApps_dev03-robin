#!/bin/bash/

__repodir="/Users/shared/Repos/VideoProjects_/dev01-bruce/2024-04-08-build-rag-with-javascript"
__repodir="/Users/shared/Repos/VPApps_/dev02-robin/client1/c11_build-rag-app"

  aDB_File="${__repodir}/my_chroma_data/chroma.sqlite3"

  chroma run --host localhost --port 8000 --path "${aDB_File}"
  exit 


# aSQL="SELECT ROW_NUMBER() OVER (ORDER BY name) AS num,name,tbl_name,rootpage FROM sqlitemaster WHERE type='table' AND name NOT LIKE 'sqlite%'" 
  aSQL="SELECT name FROM sqlite_master WHERE type='table'"

  aSQL="SELECT * FROM pragma_table_info('collection_metadata')"
# aSQL="SELECT * FROM collection_metadata"

   echo -e "\n  SQL: ${aSQL}\n" 
   sqlite3 "${aDB_File}" "${aSQL};" | awk '{ print "    " $0 }' 
   echo "" 

  # migrations
  # embeddings_queue
  # embeddings_queue_config
  # collection_metadata
  # segment_metadata
  # tenants
  # databases
  # collections
  # maintenance_log
  # segments
  # embeddings
  # embedding_metadata
  # max_seq_id
  # embedding_fulltext_search
  # embedding_fulltext_search_data
  # embedding_fulltext_search_idx
  # embedding_fulltext_search_content
  # embedding_fulltext_search_docsize
  # embedding_fulltext_search_config
