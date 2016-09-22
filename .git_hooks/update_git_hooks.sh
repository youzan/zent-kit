#!/bin/bash

youzan=$1
projectPath=`pwd`

# install package
installPackage()
{
  pn=$1
  printf "\n========== Install ${pn} start ==========\n"
  npm install -g "$pn"
  printf "\n========== Install ${pn} done ==========\n"
}

# check if package is already installed
# if not install it
checkAndInstallPackage()
{
  pn=$1
  v=$2
  printf "\n========== Check ${pn} ==========\n"
  if [[ $packageList == '' ]]; then
    packageList=`npm list -g --depth=0 2> /dev/null`
  fi
  echo "$packageList" | grep "$pn""@"
  if [[ $? == '1' ]]; then
    installPackage "${pn}""${v}"
  fi
}

# Check for eslint
which eslint &> /dev/null
if [[ "$?" == 1 ]]; then
  installPackage "eslint@2.11.1"
fi

# Check for scss_lint
which scss-lint &> /dev/null
if [[ "$?" == 1 ]]; then
  printf '\n========== Install scss_lint@0.48.0 start ==========\n'
  gem install scss_lint --version=0.48.0
  printf '\n========== Install scss_lint@0.48.0 done ==========\n'
fi

# Check eslint-plugin-react
checkAndInstallPackage 'eslint-plugin-react' '@5.1.1'
checkAndInstallPackage 'babel-eslint' '@6.0.4'
checkAndInstallPackage 'eslint-plugin-import' '@1.8.1'
checkAndInstallPackage 'eslint-plugin-jsx-a11y' '@1.2.3'
checkAndInstallPackage 'eslint-config-airbnb' '@9.0.1'
checkAndInstallPackage 'eslint-plugin-lean-imports' '@0.3.3'

# cd to hooks folder
cd ./.git_hooks

printf '\n========== init .eslintignore start ==========\n'
cp ./.eslintignore "$projectPath"
printf '\n========== init .eslintignore done ==========\n'

if [[ $youzan == "youzan" ]]; then
  printf '\n========== init .felintrc start ==========\n'
  cp ./.felintrc "$projectPath"
  printf '\n========== init .felintrc done ==========\n'
fi

printf '\n========== init hook ==========\n'
mkdir "${projectPath}/.git/hooks/"
hooks="${projectPath}/.git/hooks/"
rm -f "${hooks}/pre-commit" "${hooks}/pre-push" "${hooks}/post-merge" "${hooks}/commit-msg"
ln -s ../../.git_hooks/pre-commit "$hooks"
ln -s ../../.git_hooks/pre-push "$hooks"
ln -s ../../.git_hooks/post-merge "$hooks"
ln -s ../../.git_hooks/commit-msg "$hooks"
printf '\n========== chmod hook ==========\n'
chmod a+x "./pre-commit"
chmod a+x "./pre-push"
chmod a+x "./post-merge"
chmod a+x "./commit-msg"
printf '\n========== chmod hook done ==========\n'

printf '\n========== init hook done ==========\n'

# config git by the way
printf '\n========== git setting ==========\n'

printf '\n git config push.default => simple \n'
git config --replace-all push.default simple

printf '\n git config merge.ff => true \n'
git config --replace-all merge.ff true

printf '\n git config pull.rebase => false \n'
git config --replace-all pull.rebase false

printf '\n========== git setting done ==========\n'

printf '\n========== ALL DONE, THANKS\n'