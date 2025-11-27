#!/bin/bash
# Script to check email configuration on .git config
ALLOWED_EMAIL_DOMAINS=("@knowledgecatalyst.io" "@kc.io", "@credential.id")

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Get the email from git config
GIT_EMAIL=$(git config user.email)
if [ -z "$GIT_EMAIL" ]; then
    echo -e "${RED}Error: No email configured in git.${NC}"
    exit 1
fi

# Check if the email domain is allowed
EMAIL_DOMAIN="${GIT_EMAIL##*@}"
DOMAIN_ALLOWED=false
for domain in "${ALLOWED_EMAIL_DOMAINS[@]}"; do
    if [[ "$EMAIL_DOMAIN" == "${domain#@}" ]]; then
        DOMAIN_ALLOWED=true
        break
    fi
done
if [ "$DOMAIN_ALLOWED" = true ]; then
    echo -e "${GREEN}Success: Email domain is allowed.${NC}"
    exit 0
else
    echo -e "${RED}Error: Email domain '$EMAIL_DOMAIN' is not allowed. Please use an email from the following domains: ${ALLOWED_EMAIL_DOMAINS[*]}${NC}"
    exit 1
fi