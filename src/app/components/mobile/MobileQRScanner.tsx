import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ScanLine, QrCode, Copy, CheckCircle, HelpCircle, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import MobileBottomNav, { MobileScreen } from './MobileBottomNav';
import { useAppContext } from './MobileAppContainerEnhanced';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';

interface MobileQRScannerProps {
  onNavigate: (screen: MobileScreen, data?: any) => void;
}

export default function MobileQRScanner({ onNavigate }: MobileQRScannerProps) {
  const { theme, userData } = useAppContext();
  const [activeTab, setActiveTab] = useState('scan');
  const [isScanning, setIsScanning] = useState(false);
  const [showScanSuccessModal, setShowScanSuccessModal] = useState(false);
  const [showCodeSuccessModal, setShowCodeSuccessModal] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [codeInputs, setCodeInputs] = useState<string[]>(['']);
  const [inputErrors, setInputErrors] = useState<boolean[]>([false]);
  const [submittedCodesCount, setSubmittedCodesCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');

  // Handle tab change with direction
  const handleTabChange = (newTab: string) => {
    const tabs = ['scan', 'myqr', 'code'];
    const currentIndex = tabs.indexOf(activeTab);
    const newIndex = tabs.indexOf(newTab);
    setSlideDirection(newIndex > currentIndex ? 'left' : 'right');
    setActiveTab(newTab);
  };

  const handleScanNow = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      setShowScanSuccessModal(true);
    }, 2000);
  };

  const handleCopyQR = () => {
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitCode = () => {
    // Validate all inputs instantly
    const errors = codeInputs.map(code => code.length !== 16);
    setInputErrors(errors);
    
    if (errors.some(error => error)) {
      // Show error toast instantly (no animation)
      toast.error('กรุณาระบุรหัสให้ครบ 16 ตัว');
      return;
    }
    
    // Show processing state
    setIsSubmitting(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setSubmittedCodesCount(codeInputs.length);
      setIsSubmitting(false);
      setShowCodeSuccessModal(true);
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        setShowCodeSuccessModal(false);
        setCodeInputs(['']);
        setInputErrors([false]);
      }, 2000);
    }, 1200);
  };

  const handleAddNewCode = () => {
    if (codeInputs.length < 5) {
      setCodeInputs([...codeInputs, '']);
      setInputErrors([...inputErrors, false]);
    } else {
      toast.info('Maximum 5 codes allowed');
    }
  };

  const handleCodeInputChange = (index: number, value: string) => {
    const sanitized = value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 16);
    const newInputs = [...codeInputs];
    newInputs[index] = sanitized;
    setCodeInputs(newInputs);
    
    // Clear error when user types
    if (inputErrors[index]) {
      const newErrors = [...inputErrors];
      newErrors[index] = false;
      setInputErrors(newErrors);
    }
  };

  const handleRemoveCode = (index: number) => {
    if (codeInputs.length > 1) {
      setCodeInputs(codeInputs.filter((_, i) => i !== index));
      setInputErrors(inputErrors.filter((_, i) => i !== index));
    }
  };

  const ScanQRContent = () => (
    <div className="relative h-full flex flex-col" style={{ backgroundColor: '#000000' }}>
      {/* Camera Preview Background */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          {/* Simulated camera noise/grain effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        {/* Scanning Frame */}
        <div className="relative w-72 h-72 mb-8">
          {/* Corner Borders */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Top Left */}
            <div className="absolute top-0 left-0 w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white to-transparent rounded-full" />
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-white to-transparent rounded-full" />
            </div>
            {/* Top Right */}
            <div className="absolute top-0 right-0 w-16 h-16">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-white to-transparent rounded-full" />
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-white to-transparent rounded-full" />
            </div>
            {/* Bottom Left */}
            <div className="absolute bottom-0 left-0 w-16 h-16">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-white to-transparent rounded-full" />
              <div className="absolute bottom-0 left-0 w-1 h-full bg-gradient-to-t from-white to-transparent rounded-full" />
            </div>
            {/* Bottom Right */}
            <div className="absolute bottom-0 right-0 w-16 h-16">
              <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-white to-transparent rounded-full" />
              <div className="absolute bottom-0 right-0 w-1 h-full bg-gradient-to-t from-white to-transparent rounded-full" />
            </div>
          </motion.div>

          {/* Animated Scanning Line */}
          {isScanning && (
            <motion.div
              className="absolute left-0 right-0 h-1"
              style={{
                background: 'linear-gradient(90deg, transparent, #2E5BFF, transparent)',
                boxShadow: '0 0 20px #2E5BFF, 0 0 40px #2E5BFF',
              }}
              animate={{
                top: ['0%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}

          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={isScanning ? {
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5],
              } : {
                scale: 1,
                opacity: 0.3
              }}
              transition={{
                duration: 2,
                repeat: isScanning ? Infinity : 0,
                ease: 'easeInOut',
              }}
            >
              <ScanLine className="w-20 h-20 text-white" />
            </motion.div>
          </div>
        </div>

        {/* Instruction Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white text-center mb-8 px-6"
        >
          Align your QR code within the frame to scan.
        </motion.p>

        {/* Scan Now Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleScanNow}
            disabled={isScanning}
            className="px-12 py-6 h-auto text-lg rounded-2xl relative overflow-hidden"
            style={{ 
              backgroundColor: isScanning ? '#6B7280' : '#2E5BFF',
              boxShadow: '0 8px 24px rgba(46, 91, 255, 0.4)'
            }}
          >
            {isScanning ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="inline-block mr-2"
                >
                  <ScanLine className="w-5 h-5" />
                </motion.div>
                Scanning...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Scan Now
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );

  const MyQRContent = () => (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: '#F8FAFD' }}>
      <div className="flex-1 overflow-y-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          {/* QR Code Card */}
          <Card 
            className="overflow-hidden mb-6 w-full max-w-sm"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
          >
            <div
              className="p-8 text-center"
              style={{ background: 'linear-gradient(135deg, #2E5BFF, #5B7FFF)' }}
            >
              {/* Mock QR Code */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white p-6 rounded-3xl inline-block mb-6"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              >
                <div className="w-56 h-56 bg-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {/* QR Pattern Simulation */}
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1 p-4">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: Math.random() > 0.5 ? 1 : 0 }}
                        transition={{ delay: i * 0.01 }}
                        className="bg-white rounded-sm"
                      />
                    ))}
                  </div>
                  <QrCode className="w-32 h-32 text-white relative z-10" />
                </div>
              </motion.div>

              {/* User Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white"
              >
                <h3 className="text-2xl mb-2">{userData?.name || 'Member'}</h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-xl">{userData?.tierIcon || '🥇'}</span>
                  <span className="text-lg">{userData?.tier || 'Gold'} Member</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg py-2 px-4 inline-block">
                  <p className="text-sm text-white/80 mb-0.5">Member ID</p>
                  <p className="text-xl tracking-wider">{userData?.memberId || 'M123456'}</p>
                </div>
              </motion.div>
            </div>
          </Card>

          {/* Copy Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full max-w-sm mb-6"
          >
            <Button
              onClick={handleCopyQR}
              variant="outline"
              className="w-full h-14 text-base rounded-2xl border-2 relative overflow-hidden"
              style={{ 
                borderColor: copied ? '#10B981' : '#2E5BFF',
                color: copied ? '#10B981' : '#2E5BFF'
              }}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="copied"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Copied!
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-5 h-5" />
                    Copy QR Code
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* Instruction Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center px-6"
          >
            <p className="text-gray-600 leading-relaxed">
              Show this QR code at the counter to earn points.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );

  const EnterCodeContent = () => {
    // Get border color based on validation state (instant, no transition)
    const getBorderColor = (index: number) => {
      const code = codeInputs[index];
      if (inputErrors[index]) return '#E53935'; // Error red
      if (code.length === 16) return '#22C55E'; // Success green
      return '#D1D5DB'; // Neutral gray
    };

    return (
      <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: '#F8FAFD' }}>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col">
            {/* Title */}
            <h3
              className="text-gray-900 mb-2 text-center mt-4"
              style={{ fontSize: '18px', fontWeight: '700' }}
            >
              Enter Code
            </h3>

            {/* Description */}
            <p
              className="text-gray-600 mb-6 text-center"
              style={{ fontSize: '13px', color: 'var(--text-secondary)' }}
            >
              ระบุรหัส 16 ตัว เพื่อส่งชิงโชค
            </p>

            {/* Input Fields - No animations during typing */}
            <div className="space-y-3 mb-4">
              {codeInputs.map((code, index) => (
                <div
                  key={index}
                  className="relative"
                >
                  <Input
                    value={code}
                    onChange={(e) => handleCodeInputChange(index, e.target.value)}
                    placeholder="XXXX-XXXX-XXXX-XX"
                    maxLength={16}
                    disabled={isSubmitting}
                    className="h-12 text-sm tracking-wider pr-10"
                    style={{
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontSize: '14px',
                      padding: '0 40px 0 12px',
                      borderWidth: '1px',
                      borderColor: getBorderColor(index),
                      transition: 'none'
                    }}
                  />
                  
                  {/* Success checkmark - instant appearance */}
                  {code.length === 16 && !inputErrors[index] && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}

                  {/* Remove button */}
                  {codeInputs.length > 1 && (
                    <button
                      onClick={() => handleRemoveCode(index)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Error message - static display */}
                  {inputErrors[index] && (
                    <p className="text-xs text-red-500 mt-1.5 ml-1">
                      กรุณาระบุรหัสให้ครบ 16 ตัว
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Code Button - instant add */}
            {codeInputs.length < 5 && (
              <div className="mb-6">
                <Button
                  onClick={handleAddNewCode}
                  disabled={isSubmitting}
                  variant="outline"
                  className="w-full h-12 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                  style={{ borderRadius: '12px' }}
                >
                  <span className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-2">
                    <span>+</span>
                    Add another code
                  </span>
                </Button>
              </div>
            )}

            {/* Submit Button */}
            <div className="mb-6">
              <Button
                onClick={handleSubmitCode}
                disabled={isSubmitting || !codeInputs.every(code => code.length === 16)}
                className="w-full h-12 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: codeInputs.every(code => code.length === 16) ? 'var(--primary-color)' : '#9CA3AF',
                  color: 'white',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '500'
                }}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                    />
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Submit Code'
                )}
              </Button>
            </div>

            {/* Input count indicator */}
            <div className="text-center text-xs text-gray-500">
              {codeInputs.length} code{codeInputs.length > 1 ? 's' : ''} entered • Max 5 codes
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div
        className="text-white px-6 py-4 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #2E5BFF, #5B7FFF)' }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-white text-xl">Quick Scan</h2>
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto h-14 bg-transparent p-0 rounded-none">
            <TabsTrigger
              value="scan"
              className="flex-1 data-[state=active]:border-b-2 rounded-none h-full relative"
              style={{
                borderColor: activeTab === 'scan' ? '#2E5BFF' : 'transparent',
                color: activeTab === 'scan' ? '#2E5BFF' : '#6B7280',
              }}
            >
              <motion.div
                animate={activeTab === 'scan' ? { scale: 1.05 } : { scale: 1 }}
                className="flex flex-col items-center gap-1"
              >
                <ScanLine className="w-5 h-5" />
                <span className="text-sm">Scan QR Code</span>
              </motion.div>
            </TabsTrigger>
            <TabsTrigger
              value="myqr"
              className="flex-1 data-[state=active]:border-b-2 rounded-none h-full"
              style={{
                borderColor: activeTab === 'myqr' ? '#2E5BFF' : 'transparent',
                color: activeTab === 'myqr' ? '#2E5BFF' : '#6B7280',
              }}
            >
              <motion.div
                animate={activeTab === 'myqr' ? { scale: 1.05 } : { scale: 1 }}
                className="flex flex-col items-center gap-1"
              >
                <QrCode className="w-5 h-5" />
                <span className="text-sm">My QR Code</span>
              </motion.div>
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="flex-1 data-[state=active]:border-b-2 rounded-none h-full"
              style={{
                borderColor: activeTab === 'code' ? '#2E5BFF' : 'transparent',
                color: activeTab === 'code' ? '#2E5BFF' : '#6B7280',
              }}
            >
              <motion.div
                animate={activeTab === 'code' ? { scale: 1.05 } : { scale: 1 }}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-lg">123</span>
                <span className="text-sm">Enter Code</span>
              </motion.div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content with Smart Animate */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: slideDirection === 'left' ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideDirection === 'left' ? -100 : 100 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            {activeTab === 'scan' && <ScanQRContent />}
            {activeTab === 'myqr' && <MyQRContent />}
            {activeTab === 'code' && <EnterCodeContent />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scan Success Modal */}
      <Dialog open={showScanSuccessModal} onOpenChange={setShowScanSuccessModal}>
        <DialogContent className="max-w-sm">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            <DialogHeader>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-4xl"
                >
                  ✅
                </motion.div>
              </motion.div>
              <DialogTitle className="text-center text-2xl">QR Code Scanned Successfully!</DialogTitle>
              <DialogDescription className="text-center text-base">
                You've earned <span className="text-green-600 font-semibold">+100 points</span>
              </DialogDescription>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={() => {
                  setShowScanSuccessModal(false);
                  setTimeout(() => onNavigate('home'), 300);
                }}
                className="w-full mt-6 h-12 text-lg rounded-xl"
                style={{ backgroundColor: '#2E5BFF' }}
              >
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Code Success Modal */}
      <Dialog open={showCodeSuccessModal} onOpenChange={setShowCodeSuccessModal}>
        <DialogContent className="max-w-sm border-0">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <DialogHeader className="space-y-4">
              {/* Success Icon */}
              <div className="mx-auto">
                <div 
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"
                  style={{ boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4)' }}
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Title */}
              <div>
                <DialogTitle className="text-center text-2xl text-gray-900">
                  Code submitted successfully!
                </DialogTitle>
              </div>

              {/* Description */}
              <div>
                <DialogDescription className="text-center text-base text-gray-600">
                  Your {submittedCodesCount} code{submittedCodesCount > 1 ? 's have' : ' has'} been submitted for lucky draw
                </DialogDescription>
              </div>
            </DialogHeader>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation - Hidden for scan tab */}
      {activeTab !== 'scan' && (
        <MobileBottomNav
          currentScreen="qr-scanner"
          onNavigate={onNavigate}
          primaryColor={theme.primary}
        />
      )}
    </div>
  );
}
