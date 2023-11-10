//
//  NFCReaderModule.m
//  AwesomeProject
//
//  Created by Microloop Bhumi on 8/23/23.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(NFCReaderModule, RCTEventEmitter)

RCT_EXTERN_METHOD(startNFCReader:(NSString *)options)
RCT_EXTERN_METHOD(stopNFCReader)
RCT_EXTERN_METHOD(supportedEvents)
@end
