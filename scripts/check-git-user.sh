#!/bin/bash
# Script to check username configuration on .git config

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Get the username from git config
GIT_USERNAME=$(git config user.name)

# Check if username is empty
if [ -z "$GIT_USERNAME" ]; then
    echo -e "${RED}Error: No username configured in git.${NC}"
    exit 1
fi

# Check if the username ends with "kc" (Case Insensitive)
# We convert the username to lowercase for comparison to handle 'KC', 'Kc', or 'kc'
USERNAME_LOWER=$(echo "$GIT_USERNAME" | tr '[:upper:]' '[:lower:]')

if [[ "$USERNAME_LOWER" == *"kc" ]]; then
    echo -e "${GREEN}Success: Git username '$GIT_USERNAME' is allowed.${NC}"
    exit 0
else
    echo -e "${RED}Error: Git username '$GIT_USERNAME' is not allowed.${NC}"
    echo -e "${RED}Your username must end with 'kc' (e.g., ranggakc, asepkc).${NC}"
    exit 1
fi
