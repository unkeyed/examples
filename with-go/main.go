package main

import (
	"context"
	"fmt"
	"os"

	unkey "github.com/unkeyed/sdks/api/go/v2"
	"github.com/unkeyed/sdks/api/go/v2/models/components"
)

func main() {
	rootKey := os.Getenv("UNKEY_ROOT_KEY")
	if rootKey == "" {
		panic("UNKEY_ROOT_KEY environment variable is required")
	}

	apiName := os.Getenv("UNKEY_API_NAME")
	if apiName == "" {
		apiName = "unkey-rocks" // Default fallback
	}

	keyName := os.Getenv("UNKEY_KEY_NAME")
	if keyName == "" {
		keyName = "unkey-key-rocks" // Default fallback
	}

	u := unkey.New(unkey.WithSecurity(rootKey))
	ctx := context.Background()

	// Step 1: Create API
	fmt.Println("🚀 Creating API...")
	createAPIRes, err := u.Apis.CreateAPI(ctx, components.V2ApisCreateAPIRequestBody{
		Name: apiName,
	})
	if err != nil {
		panic(fmt.Sprintf("Failed to create API: %v", err))
	}

	apiID := createAPIRes.V2ApisCreateAPIResponseBody.Data.APIID
	fmt.Printf("✅ API created successfully! ID: %s\n", apiID)

	// Step 2: Create Key
	fmt.Println("\n🔑 Creating API key...")
	createKeyRes, err := u.Keys.CreateKey(ctx, components.V2KeysCreateKeyRequestBody{
		APIID: apiID,
		Name:  &keyName,
	})
	if err != nil {
		panic(fmt.Sprintf("Failed to create key: %v", err))
	}

	createdKey := createKeyRes.V2KeysCreateKeyResponseBody.Data.Key
	keyID := createKeyRes.V2KeysCreateKeyResponseBody.Data.KeyID
	fmt.Printf("✅ Key created successfully! ID: %s\n", keyID)
	fmt.Printf("🔐 Key: %s\n", createdKey)

	// Step 3: Verify Key
	fmt.Println("\n🔍 Verifying the key...")
	res, err := u.Keys.VerifyKey(ctx, components.V2KeysVerifyKeyRequestBody{
		Key: createdKey,
	})
	if err != nil {
		panic(fmt.Sprintf("Failed to verify key: %v", err))
	}

	if res.V2KeysVerifyKeyResponseBody.Data.Valid {
		fmt.Printf("✅ Key is valid!\n")
		fmt.Printf("📊 Response: %+v\n", res.V2KeysVerifyKeyResponseBody)
	} else {
		fmt.Printf("❌ Key is invalid! Code: %s\n", res.V2KeysVerifyKeyResponseBody.Data.Code)
	}

	fmt.Println("\n🎉 Flow completed successfully!")
}
