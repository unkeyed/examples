package main

import (
	"context"
	"fmt"

	unkey "github.com/unkeyed/unkey/sdks/golang"
	"github.com/unkeyed/unkey/sdks/golang/models/operations"
)

func main() {

	u := unkey.New((unkey.WithSecurity("<UNKEY_ROOT_KEY>")))
	
ctx := context.Background()
	api, err := u.Apis.GetAPI(ctx,operations.GetAPIRequest{APIID: "<UNKEY_API_ID>"})
	if err != nil {
		panic(err)
	}

	// Print the API
	fmt.Printf("API: %+v\n", api)



	key, err := u.Keys.CreateKey(ctx, operations.CreateKeyRequestBody{
		APIID: "<UNKEY_API_ID>",
	})

	if err != nil {
		panic(err)
	}
	fmt.Printf("Key: %+v\n", key)


}