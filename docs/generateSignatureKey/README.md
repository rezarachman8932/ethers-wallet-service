## API Documentation: Generating the Signature Key

To ensure security and data integrity, every API request requires a valid Signature Key. This signature is generated using a combination of your `UUID`, your `secret Access Key`, and the `Request Body (payload)`.

Prerequisites
Before generating a signature, ensure you have the following data:

**UUID**: Your unique platform ID (e.g., `654079c7-c19a-4748-b0a5-dc1990f4776f`).

**Access Key**: Your access key (e.g., `f8cfad...`).

**Request Body**: The JSON data payload you intend to send.

Generation Algorithm
The signature generation process uses the **SHA-256** hashing algorithm with a **Hexadecimal** output format.

## Step 1: Generate Temporary Auth Token

This token is derived from your `UUID` and `Access Key`.

Concatenate the strings in this format: `${uuid}:${accessKey}`

Apply **SHA-256** hashing to the resulting string.

The result is your `auth_token`.

Formula: `auth_token = SHA256(uuid + ":" + accessKey)`

## Step 2: Generate Final Signature Key

The signature is derived from the `Request` Body and the `auth_token` (from Step 1).

Convert your JSON body object into a string (Serialization).

Important: The string must be exactly identical to the raw body sent over HTTP. Typically, this means **no whitespaces** (minified JSON).

Concatenate the strings in this format: `${json_body_string}:${auth_token}`

Apply **SHA-256** hashing to the resulting string.

The result is your final `signature_key`.

Formula: `signature_key = SHA256(JSON_String + ":" + auth_token)`

#

### Implementation Examples

Below are examples of how to generate the signature in various programming languages

### 1. Node.js (JavaScript)

```javascript
const crypto = require('crypto');

// 1. Configuration
const uuid = '654079c7-c19a-4748-b0a5-dc1990f4776f';
const accessKey = 'f8cfad84d4ee69928844127a2e2fef30ed1c2f599a40ba5068182d7386b6d6a7';
const body = {
  fiatCurrency: 'IDR',
  cryptoSymbol: 'POL',
  amount: 50000,
};

// 2. Helper Function
const generateHash = (content) => {
  return crypto.createHash('sha256').update(content).digest('hex');
};

// 3. Step 1: Generate Token
const tokenSource = `${uuid}:${accessKey}`;
const token = generateHash(tokenSource);

// 4. Step 2: Generate Signature
// Note: JSON.stringify produces a minified string (no spaces)
const bodyString = JSON.stringify(body);
const signatureSource = `${bodyString}:${token}`;
const signatureKey = generateHash(signatureSource);

console.log('Signature Key:', signatureKey);
```

### 2. PHP

```php
<?php

$uuid = '654079c7-c19a-4748-b0a5-dc1990f4776f';
$accessKey = 'f8cfad84d4ee69928844127a2e2fef30ed1c2f599a40ba5068182d7386b6d6a7';

$body = [
    "fiatCurrency" => "IDR",
    "cryptoSymbol" => "POL",
    "amount" => 50000
];

// Step 1: Generate Token
// Format: uuid:accessKey
$token = hash('sha256', $uuid . ':' . $accessKey);

// Step 2: Generate Signature
// json_encode typically produces minified JSON by default
$bodyString = json_encode($body);

// Format: bodyString:token
$signatureKey = hash('sha256', $bodyString . ':' . $token);

echo "Signature Key: " . $signatureKey;
?>
```

### 3. Python

```python
import hashlib
import json

uuid = '654079c7-c19a-4748-b0a5-dc1990f4776f'
access_key = 'f8cfad84d4ee69928844127a2e2fef30ed1c2f599a40ba5068182d7386b6d6a7'

body = {
    "fiatCurrency": "IDR",
    "cryptoSymbol": "POL",
    "amount": 50000
}

# Helper Function
def get_sha256(data):
    return hashlib.sha256(data.encode('utf-8')).hexdigest()

# Step 1: Generate Token
token_source = f"{uuid}:{access_key}"
token = get_sha256(token_source)

# Step 2: Generate Signature
# 'separators' argument is CRITICAL to remove spaces (minify) to match JS/PHP output
body_string = json.dumps(body, separators=(',', ':'))
signature_source = f"{body_string}:{token}"
signature_key = get_sha256(signature_source)

print(f"Signature Key: {signature_key}")
```

#

### Common Troubleshooting

**Signature Invalid?** If the server rejects your signature, please check the following:

- **JSON Key Ordering**: The order of keys in the stringified JSON matters. Ensure the string you hash matches the string sent in the HTTP body exactly.

- **Whitespace**: JavaScript's `JSON.stringify()` creates a string with no spaces. Ensure your language's JSON serializer (like Python's `json.dumps`) is configured to remove extra spaces after colons and commas.

- **String Formatting**: Ensure there are no hidden newline characters (`\n`) or extra spaces when concatenating the variables before hashing.
