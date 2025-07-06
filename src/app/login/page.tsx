'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/useStore'
import { vendorAuthApi, vendorApi } from '@/lib/api/client'
import { loginSchema, type LoginFormData } from '@/lib/validators/schemas'
import { toast } from 'sonner'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setAuth, isAuthenticated } = useAuthStore()

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      // Login via vendor auth API
      const loginResponse = await vendorAuthApi.login(data.email, data.password)
      
      // Extract vendor and token data from response
      console.log('Login response:', loginResponse)
      
      // Backend returns data in .message property
      const responseData = loginResponse.message || loginResponse.data
      const vendor = responseData.vendor
      const tokens = responseData.tokens
      
      if (!vendor || !tokens) {
        throw new Error('Invalid response format from server')
      }
      
      // Create user object from vendor data
      const user = {
        id: vendor.id,
        email: vendor.email,
        firstName: vendor.contactPersonName?.split(' ')[0] || '',
        lastName: vendor.contactPersonName?.split(' ').slice(1).join(' ') || ''
      }
      
      // Create store object from vendor data
      const store = {
        id: vendor.id,
        name: vendor.businessName,
        description: vendor.description,
        logoUrl: vendor.logoUrl,
        email: vendor.email,
        isActive: vendor.status === 'active'
      }
      
      console.log('Created user:', user)
      console.log('Created store:', store)
      console.log('Access token:', tokens.accessToken)
      
      // Set auth state
      setAuth(user, store, tokens.accessToken)
      
      console.log('Auth state set, redirecting...')
      toast.success('Login successful!')
      
      // Force redirect to dashboard
      window.location.href = '/dashboard'
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            RENART Vendor Panel
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your vendor account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Test Credentials Hint */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Test Vendor Account</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Email:</strong> vendor@renart.com</p>
              <p><strong>Password:</strong> renart123</p>
              <p className="text-blue-600">Use these credentials to test the vendor panel</p>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link 
                    href="/signup" 
                    className="font-medium text-primary hover:underline"
                  >
                    Create vendor account
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
