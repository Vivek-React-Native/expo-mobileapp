//
//  NFCReaderModule.swift
//  AwesomeProject
//
//  Created by Microloop Bhumi on 8/23/23.
//

// NFCReaderModule.swift

import Foundation
import React
import SmartCardIO
import ACSSmartCardIO

@objc(NFCReaderModule)
class NFCReaderModule : RCTEventEmitter {
  let manager = BluetoothSmartCard.shared.manager
  let cardStateMonitor = CardStateMonitor.shared
  var terminal: CardTerminal?
  var cardName : String = ""
  override func supportedEvents() -> [String]! {
          return ["terminalDataRecived","NFCDataReceived","NFCCardDataReceived","NFCCardUDIDDataReceived"]
  }
  @objc override static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  // Reference to use main thread
  @objc func startNFCReader(_ options: String) -> Void {
    DispatchQueue.main.async {
      self._startNFCReader(options: options)
    }
  }
  @objc func stopNFCReader() -> Void {
    DispatchQueue.main.async {
      self._stopNFCReader()
    }
  }
  
  func _startNFCReader(options: String) {
    print("otions",options)
    manager.delegate = self
    cardStateMonitor.delegate = self
    if options == "ACR3901U-S1/ACR3901T-W1"{
      manager.startScan(terminalType: .acr3901us1)
    }
    else if options == "ACR1255U-J1"{
      manager.startScan(terminalType: .acr1255uj1)
    }
    else if options == "AMR220-C"{
      manager.startScan(terminalType: .amr220c)
    }
    else if options == "ACR1255U-J1 V2"{
      manager.startScan(terminalType: .acr1255uj1v2)
    }
  }
  func _stopNFCReader() {
    manager.stopScan()
    if let terminalT = self.terminal{
      do {
        try self.manager.disconnect(terminal: terminalT)
      }catch {
          print("Error: \(error)")
      }
      
     
      if cardStateMonitor.isTerminalEnabled(terminalT) {
        cardStateMonitor.removeTerminal(terminalT)
      }
    }
  }
  
}
extension NFCReaderModule: BluetoothTerminalManagerDelegate {

    func bluetoothTerminalManagerDidUpdateState(
        _ manager: BluetoothTerminalManager) {

        var message = ""

        switch manager.centralManager.state {

        case .unknown, .resetting:
            message = "The update is being started. Please wait until Bluetooth is ready."

        case .unsupported:
            message = "This device does not support Bluetooth low energy."

        case .unauthorized:
            message = "This app is not authorized to use Bluetooth low energy."

        case .poweredOff:
                message = "You must turn on Bluetooth in Settings in order to use the reader."
        print("message",message)
        default:
            break
        }

    }

    func bluetoothTerminalManager(_ manager: BluetoothTerminalManager,
                                  didDiscover terminal: CardTerminal) {
print("terminal.name",terminal.name)
        // Show the terminal.
      self.sendEvent(withName: "terminalDataRecived", body: ["data": terminal.name])
      self.terminal = terminal
      cardStateMonitor.addTerminal(terminal)
    }
  
}

// MARK: - CardStateMonitorDelegate
extension NFCReaderModule: CardStateMonitorDelegate {

    func cardStateMonitor(_ monitor: CardStateMonitor,
                          didChangeState terminal: CardTerminal,
                          prevState: CardStateMonitor.CardState,
                          currState: CardStateMonitor.CardState) {
        if prevState.rawValue > CardStateMonitor.CardState.absent.rawValue
            && currState.rawValue <= CardStateMonitor.CardState.absent.rawValue {
//            print("\(terminal.name + ": removed")")
          self.sendEvent(withName: "NFCDataReceived", body: ["data": "card removed"])
          self.sendEvent(withName: "NFCCardDataReceived", body: ["data": ""])
          self.sendEvent(withName: "NFCCardUDIDDataReceived", body: ["data": ""])
        } else if prevState.rawValue <= CardStateMonitor.CardState.absent.rawValue
            && currState.rawValue > CardStateMonitor.CardState.absent.rawValue {
//          print("\(terminal.name + ": inserted")")
          self.sendEvent(withName: "NFCDataReceived", body: ["data": "card inserted"])
          if let terminal = self.terminal{
            do {
              let card = try terminal.connect(protocolString: "*")
              print("card.atr.bytes",Hex.toHexString(buffer: card.atr.bytes))
              self.readCardType(atr: card.atr.bytes, card: card)
            }
            catch {
              print("Error: \(error)")
            }
          }
        }
    }
}
extension NFCReaderModule {
  
  //MARK: - Get Card Type
  func readCardType(atr:[UInt8],card: SmartCardIO.Card) {
      cardName = "Unknown"
      let byteArray: [Int8] = [-96, 0, 0, 3, 6]
      let bArr: [UInt8] = byteArray.map { UInt8(bitPattern: $0) }
      if atr.count < 4 {
          print("Invalid card detected")
      } else if atr[4] == UInt8(bitPattern: -128) && atr[5] == 79 {
          if Array(atr[7..<12]) == bArr {
              let copyOfRange = Array(atr[13..<15])
              let b = copyOfRange[1]
              
              if b != 59 {
                  switch b {
                  case 1, 2:
                      cardName = "Mifare Classic"
                  default:
                      self.getOthersCardType(Int(copyOfRange[1]))
                      print("Invalid card detected")
                  }
              } else {
                  cardName = "Felica"
              }
          } else {
              print("Invalid card detected")
          }
      } else if atr[4] == 16 {
          cardName = "Memory Card"
          print("Invalid card detected")
      } else if atr[4] == 0 {
//            getCardVersion()
      } else { }
      
    self.getTagUDID(card: card)
  }

  private func getOthersCardType(_ i: Int) {
      switch i {
          case 3:
              cardName = "Mifare Ultralight"
          case 4:
              cardName = "SLE55R_XXXX"
          case 6:
              cardName = "SR176"
          case 7:
              cardName = "SRI X4K"
          case 8:
              cardName = "AT88RF020"
          case 9:
              cardName = "AT88SC0204CRF"
          case 10:
              cardName = "AT88SC0808CRF"
          case 11:
              cardName = "AT88SC1616CRF"
          case 12:
              cardName = "AT88SC3216CRF"
          case 13:
              cardName = "AT88SC6416CRF"
          case 14:
              cardName = "SRF55V10P"
          case 15:
              cardName = "SRF55V02P"
          case 16:
              cardName = "SRF55V10S"
          case 17:
              cardName = "SRF55V02S"
          case 18:
              cardName = "TAG IT"
          case 19:
              cardName = "LR1512"
          case 20:
              cardName = "ICODESLI"
          case 21:
              cardName = "TEMPSENS"
          case 22:
              cardName = "I.CODE1"
          case 23:
              cardName = "PicoPass 2K"
          case 24:
              cardName = "PicoPass 2KS"
          case 25:
              cardName = "PicoPass 16K"
          case 26:
              cardName = "PicoPass 16Ks"
          case 27:
              cardName = "PicoPass 16K(8x2)"
          case 28:
              cardName = "PicoPass 16Ks(8x2)"
          case 29:
              cardName = "PicoPass 32KS(16+16)"
          case 30:
              cardName = "PicoPass 32KS(16+8x2)"
          case 31:
              cardName = "PicoPass 32KS(8x2+16)"
          case 32:
              cardName = "PicoPass 32KS(8x2+8x2)"
          case 33:
              cardName = "LRI64"
          case 34:
              cardName = "I.CODE UID"
          case 35:
              cardName = "I.CODE EPC"
          case 36:
              cardName = "LRI12"
          case 37:
              cardName = "LRI128"
          case 38:
              cardName = "Mifare Mini"
          case 39:
              cardName = "my-d move (SLE 66R01P)"
          case 40:
              cardName = "my-d NFC (SLE 66RxxP)"
          case 41:
              cardName = "my-d proximity 2 (SLE 66RxxS)"
          case 42:
              cardName = "my-d proximity enhanced (SLE 55RxxE)"
          case 43:
              cardName = "my-d light (SRF 55V01P))"
          case 44:
              cardName = "PJM Stack Tag (SRF 66V10ST)"
          case 45:
              cardName = "PJM Item Tag (SRF 66V10IT)"
          case 46:
              cardName = "PJM Light (SRF 66V01ST)"
          case 47:
              cardName = "Jewel Tag"
          case 48:
              cardName = "Topaz NFC Tag"
          case 49:
              cardName = "AT88SC0104CRF"
          case 50:
              cardName = "AT88SC0404CRF"
          case 51:
              cardName = "AT88RF01C"
          case 52:
              cardName = "AT88RF04C"
          case 53:
              cardName = "i-Code SL2"
          case 54:
              cardName = "Mifare Plus SL1_2K"
          case 55:
              cardName = "Mifare Plus SL1_4K"
          case 56:
              cardName = "Mifare Plus SL2_2K"
          case 57:
              cardName = "Mifare Plus SL2_4K"
          case 58:
              cardName = "Mifare Ultralight C"
          case 59:
              cardName = "FeliCa"
          case 60:
              cardName = "Melexis Sensor Tag (MLX90129)"
          case 61:
              cardName = "Mifare Ultralight EV1"
          default:
              break
      }
  }
  
  //MARK: - read MIFare Classic tag
  func readCardValue(card: SmartCardIO.Card) {
    do {
      let basicChannel = try card.basicChannel()
      
      let loadAuthCommandHex = "FF 82 00 00 06 FF FF FF FF FF FF"
      let loadAuthCommand: [UInt8] = Hex.toByteArray(hexString: loadAuthCommandHex)
      self.executeCommand(command: loadAuthCommand, channel: basicChannel, stringPrint: "loadAuthCommand")
      
      
      let authCommandHex = "FF 86 00 00 05 01 00 04 60 00"
      let authCommand: [UInt8] = Hex.toByteArray(hexString: authCommandHex)
      self.executeCommand(command: authCommand, channel: basicChannel, stringPrint: "authCommand")
      
      
      
      let readNameCommandHex = "FF B0 00 05 20"
      let readNameCommand: [UInt8] = Hex.toByteArray(hexString: readNameCommandHex)
      self.executeCommand(command: readNameCommand, channel: basicChannel, stringPrint: "Name readCommand")
    }
    catch {
      print("Error: \(error)")
    }
  }
  func executeCommand(command: [UInt8],channel: CardChannel,stringPrint:String){
      do {
          let response = try channel.transmit(apdu: CommandAPDU(apdu: command))
          print("\(stringPrint) Response status: \(String(format: "0x%04X", response.sw))")
          print("\(stringPrint)  toHexString ====>",self.byteArrayToString(response.bytes, length: response.bytes.count))
        
        self.sendEvent(withName: "NFCCardDataReceived", body: ["data": self.byteArrayToString(response.bytes, length: response.bytes.count)])
        
      }catch {
          print("Error: \(error)")
      }
  }
  func byteArrayToString(_ byteArray: [UInt8], length: Int) -> String {
      var str = ""
      var i2 = 0
      
      while i2 < length && byteArray[i2] != 0 {
          str.append(Character(UnicodeScalar(byteArray[i2])))
          i2 += 1
      }
      
      return str
  }
  
  //MARK: - read NTAG213 tag
  func readNTAG213Command(card: SmartCardIO.Card){
    do {
      let basicChannel = try card.basicChannel()
      let startingPage: UInt8 = 0x07
      let bytesToRead: UInt8 = 0x20//0x10
      var responseData = [UInt8]()
      for page in startingPage...(startingPage + bytesToRead - 1) {
        let readCommand: [UInt8] = [0xFF, 0xB0, 0x00, page, 0x04]
        let response = try basicChannel.transmit(apdu: CommandAPDU(apdu: readCommand))
        
        // Check the response status
        if response.sw1 == 0x90 && response.sw2 == 0x00 {
          // Successful response
          let pageData = response.data
          responseData += pageData
        } else {
          // Error response
          print("Error response: \(response.sw1), \(response.sw2)")
          break // Exit the loop on error
        }
      }
      self.sendEvent(withName: "NFCCardDataReceived", body: ["data": self.byteArrayToStringForNTAG213(responseData, length: responseData.count)])
    }
    catch {
      print("Error: \(error)")
    }
  }
  func byteArrayToStringForNTAG213(_ byteArray: [UInt8], length: Int) -> String {
      var str = ""
      var i2 = 0
      
      while i2 < length && byteArray[i2] != 0 {
          let byteValue = byteArray[i2]
          // Check if the byte value is within the printable ASCII range
          if (0x20...0x7E).contains(byteValue) {
              str.append(Character(UnicodeScalar(byteValue)))
          }
          i2 += 1
      }
      
      return removeLanguageIndicator(str)//str
  }
  func removeLanguageIndicator(_ inputString: String) -> String {
      let regex = try! NSRegularExpression(pattern: "^[a-z]+[A-Z]")
      let range = NSRange(inputString.startIndex..<inputString.endIndex, in: inputString)

      if let _ = regex.firstMatch(in: inputString, options: [], range: range) {
          if inputString.count >= 2 {
                  let startIndex = inputString.index(inputString.startIndex, offsetBy: 2)
                  return String(inputString[startIndex...])
              } else {
                  return ""
              }
      }
      
      return inputString
  }
  
  //MARK: - Get Tag UDID
  func getTagUDID(card: SmartCardIO.Card){
    do {
      let basicChannel = try card.basicChannel()
      
      let command: [UInt8] = [0xFF, 0xCA, 0x00, 0x00, 0x00]//Hex.toByteArray(hexString: readCommandHex1)
      let response = try basicChannel.transmit(apdu: CommandAPDU(apdu: command))
      
      var str = ""
      
      for (index,byte) in response.data.enumerated() {
        let hexString = String(format: "%02X", byte)
        if index == (response.data.count - 1){
          str += hexString
        }
        else{
          str += hexString + ":"
        }
      }
      print("str",str)
      self.sendEvent(withName: "NFCCardUDIDDataReceived", body: ["data": str])
    }
    catch {
      print("Error: \(error)")
    }
    
    print("Card Name :::::::: ",cardName)
    if cardName == "Mifare Classic"{
      self.readCardValue(card: card)
    }
    else{
      self.readNTAG213Command(card: card)
    }
  }
}
