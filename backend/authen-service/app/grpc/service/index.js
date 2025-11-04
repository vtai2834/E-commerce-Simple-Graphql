// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');
// const path = require('path');
// const mongoose = require('mongoose');
// const { Facility } = require('../../datasources/mongodb/models');

// const PROTO_PATH = path.join(__dirname, '../protos/facility.proto');
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true,
// });
// const facilityProto = grpc.loadPackageDefinition(packageDefinition).facility.v1;

// const server = new grpc.Server();

// server.addService(facilityProto.FacilityService.service, {
//   async GetFacilitiesByIds(call, callback) {
//     try {
//       const ids = call.request.ids || [];
//       const facilities = await Facility.find({ _id: { $in: ids } });
//       // Map sang đúng format proto
//       const result = facilities.map(fac => ({
//         id: fac._id.toString(),
//         name: fac.name,
//         status: fac.status && fac.status.toUpperCase(),
//         phone: fac.contactInfo?.phone,
//         address: fac.contactInfo?.address,
//         city: fac.contactInfo?.city,
//         state: fac.contactInfo?.state,
//         country: fac.contactInfo?.country,
//       }));
//       callback(null, { facilities: result });
//     } catch (err) {
//       callback(err);
//     }
//   },
// });

// const PORT = process.env.FACILITY_GRPC_PORT || '0.0.0.0:50051';
// server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
//   if (err) throw err;
//   server.start();
//   console.log(`Facility gRPC server running at ${PORT}`);
// });
