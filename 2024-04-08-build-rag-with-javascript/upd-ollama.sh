#!/bin/bash 
# chsh -s /bin/bash 

  # pkill -f ollama  to stop ollama

     echo ""
if ! ollama list >/dev/null 2>&1; then 
     echo -e "* Ollama is not running"
#    ollama serve & 
     ollama serve >/dev/null 2>&1 &
     fi 
     echo -e "  Ollama is now running"
     echo -e "  To update ollama, run this:\n"   
     echo -e "  #  curl -fsSL https://ollama.com/install.sh | sh"   # update ollama 

     echo -e "\n  Here is a list of models:" 
     mModels="$( ollama list | awk 'NR > 1 { print $1 }' )"  # it's a string
     echo "${mModels}" | awk '{ printf "  %d. %s\n", NR, $0 }'

     echo -e "\n  To update them, run these commands:\n" 
     mModels=($( ollama list | awk 'NR > 1 { print $1 }' ))  # it's an array

 for model in "${mModels[@]}"; do
     echo "  #  ollama pull \"$model\""
     done
     echo ""

#    pip install --upgrade chromadb
#    chroma run --host localhost --port 8000 --path ./my_chroma_data
#    ollama pull nomic-embed-text
#    ollama pull llama3 
 #    node i--no-deprecation mport.js    
