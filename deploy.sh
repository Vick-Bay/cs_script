#!/bin/bash

# Clean up
rm -rf dist dist.zip

# Build the app
npm run build

# Create web.config in dist
cat > dist/web.config << EOL
<?xml version="1.0"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="index.html" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
    </staticContent>
  </system.webServer>
</configuration>
EOL

# Create zip
cd dist && zip -r ../dist.zip . && cd ..

# Deploy to Azure
az webapp deploy \
  --resource-group rg-csscripts-dev-eastus \
  --name app-csscripts-dev-eastus \
  --src-path dist.zip \
  --type zip \
  --clean true

# Restart the webapp
az webapp restart --name app-csscripts-dev-eastus --resource-group rg-csscripts-dev-eastus
