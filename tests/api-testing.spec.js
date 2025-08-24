    import { test, expect } from '@playwright/test';
    import { API_URL } from '../config';


    test.describe('GraphQL API Tests', () => {
        //Fetch user with his albums
        test('Get user with their albums', async ({ request }) => {
            const response = await request.post(API_URL, {     //performing post request to the API_URL
                data: {
                    query: `    
                    query {
    users(options: {paginate: {page: 1, limit: 50}}) {
        data {
        id
        name
        username
        email
        albums {
            data {
            id
            title
            }
        }
        }
    }
    }
                `
                }
            });

            const body = await response.json(); // Parse the JSON response
            console.log('Response Body:', JSON.stringify(body, null, 2)); // Log the entire response body for debugging

            expect(response.ok()).toBeTruthy(); // Check if response status is OK
            expect(body.data.users.data.length).toBeGreaterThan(0); // Ensure at least one user is returned
            expect(body.data.users.data[0]).toHaveProperty('id'); // Check if user has an ID
            expect(body.data.users.data[0]).toHaveProperty('name'); // Check if user has a name
            expect(body.data.users.data[0]).toHaveProperty('username'); // Check if user has a username
            expect(body.data.users.data[0]).toHaveProperty('email'); // Check if user has an email
            expect(body.data.users.data[0]).toHaveProperty('albums'); // Check if user has albums


            console.log('Test 1: completed successfully.');
        });

        test('Fetch album by user ID', async ({ request }) => {
            const userId = 1; // Specify the user ID for which to fetch albums
            const response = await request.post(API_URL, {
                data: {
                    query: `
                    query {
                        user(id: ${userId}) {
                            id
                            name
                            albums {
                                data {
                                    id
                                    title
                                }
                            }
                        }
                    } 
                `
                }
            });
            const body = await response.json(); // Parse the JSON response

            console.log('Response Body:', JSON.stringify(body, null, 2)); // Log the entire response body for debugging
            expect(response.ok()).toBeTruthy(); // Check if response status is OK
            expect(body.data.user.albums.data.length).toBeGreaterThan(0); // Ensure at least one album is returned
            expect(body.data.user.albums.data[0]).toHaveProperty('id'); // Check if album has an ID
            expect(body.data.user.albums.data[1]).toHaveProperty('title'); // Check if album has a title

            console.log('Test 2: completed successfully.');

        });

        test('Error handling for invalid user ID', async ({ request }) => {
            const response = await request.post(API_URL, {
                data: {
                    query: `
                    query {
                        user(id: invalidID
                        ) {
                            id
                            name
                            albums {
                                data {
                                    id
                                    title
                                }
                            }
                        }
                    } 
                `
                }
            }
            );
            const body = await response.json();
            console.log('Error Response:', JSON.stringify(body, null, 2));
            expect(body).toHaveProperty('errors'); // Check if errors property exists
            expect(body.errors[0]).toHaveProperty('message');
            expect(body.errors[0]).toHaveProperty('extensions');
            expect(body.errors[0].extensions).toHaveProperty('code');
            expect(body.errors[0].extensions.code).toBe("GRAPHQL_VALIDATION_FAILED"); // Check for specific error code
            expect(body.errors[0].message).toBe("ID cannot represent a non-string and non-integer value: invalidID"); // Check for specific error message

            console.log('Test 3: completed successfully.');
        });

        test('Creating new user', async ({ request }) => {
            const newUser = {      // Define new user details 
                name: "John Doe",
                username: "johndoe",
                email: "newUser@gmail.com"
            };
            const response = await request.post(API_URL, {
                data: {
                    query: `
                    mutation {
                        createUser(input: {name: "${newUser.name}", username: "${newUser.username}", email: "${newUser.email}"}) {
                            id
                            name
                            username
                            email
                        }
                    }
                `
                }

            });
            const body = await response.json(); // Parse the JSON response
            console.log('Create User Response:', JSON.stringify(body, null, 2)); 
            expect(body.data.createUser).toBeDefined(); // Check if createUser data is returned
            expect(body.data.createUser.name).toBe("John Doe"); // Validate the name of the created user
            expect(body.data.createUser.email).toBe("newUser@gmail.com"); // Validate the email of the created user
            expect(body.data.createUser.username).toBe("johndoe"); // Validate the username of the created user
            expect(body.data.createUser.id).toBeDefined();  // Check if the created user has an ID

            console.log('Test 4: completed successfully.');
        }

        );
        
        test('Creating album for user', async ({ request }) => {
            //const bookTitle= "My Life is a fight";
            const response = await request.post(API_URL, {
            data: {
                query: `
                    mutation {
                        createAlbum(input: {
                            title: "My Life is a fight",
                            userId: 1
                        }) {
                            id
                            title
                            user {
                                id
                                name
                            }
                        }
                    }
                `
            }
        });

        const body = await response.json();
        console.log('Create Album Response:', JSON.stringify(body, null, 2));
        
        expect(body.data.createAlbum).toBeDefined();
        expect(body.data.createAlbum.title).toBe("My Life is a fight");
        expect(body.data.createAlbum.user.id).toBe("1"); 
        expect(body.data.createAlbum.user).toHaveProperty('name');
        expect(body.data.createAlbum.id).toBeDefined();
        
        console.log('Test 5: completed successfully.');
    });
    }); 