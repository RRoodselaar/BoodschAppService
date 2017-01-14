# mobileservices-sqlserver

This is a slightly modified version of the [Microsoft Driver for Node.js for SQL Server][msnodesql], 
designed for usage from Azure Mobile Services. Specifically, it:

- maintains backwards compatibility as the driver was first included in Mobile Services as 'sqlserver', and so there is still code in the wild doing `require('sqlserver')`.
- includes prebuilt binaries for node 0.6.x, 0.8.x and 0.10.x, so no additional build steps or MSI installations are required.

[msnodesql]: https://github.com/Azure/node-sqlserver