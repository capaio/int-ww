##!/usr/bin/env sh

scan_dir()
{
  local dir=$1

  if ! [ -d "$dir" ]; then
    echo "$dir does not exist"
    return
  fi

  local search_dir="$dir/*"
  for d in $search_dir; do
    test -d "$d" || continue
    scan_dir "$d"
  done

  pattern="$dir/*.$type.sql"
  for f in $pattern; do
    test -f "$f" || continue
    renamed=$(echo "$f" | sed -e "s:$path/::")
    renamed=$(echo "$renamed" | sed -e 's:/:-:g')
    echo "Moving $f into $dest as $renamed"
    mv "$f" "$dest/$renamed"
  done
}

type=$1
path=$2
dest=$3

if [ -z "$path" ]; then
  path="."
fi

if [ -z "$dest" ]; then
  dest="/docker-entrypoint-initdb.d"
fi

scan_dir $path
