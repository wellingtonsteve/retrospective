cmd /c "npm version patch"
FOR /F "tokens=* USEBACKQ" %%F IN (`findstr "version" "package.json"`) DO (
SET vers=%%F
)
set vers=%vers:"version": "=%
set vers=%vers:",=%
git add -A
git commit -m "Bump version to %vers%"