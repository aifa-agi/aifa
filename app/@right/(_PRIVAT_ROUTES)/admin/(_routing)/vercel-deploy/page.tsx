'use client'

// Manual Vercel deployment management page
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

import { Loader2, Play, CheckCircle, XCircle, Info, GitBranch, Database, Zap } from 'lucide-react'
import { Button } from '@/app/(_service)/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/(_service)/components/ui/card'

type DeploymentStatus = 'idle' | 'building' | 'success' | 'error'

interface DeploymentInfo {
  deploymentId: string
  status: string
  url?: string
  createdAt: number
}

export default function VercelDeployPage() {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>('idle')
  const [deploymentInfo, setDeploymentInfo] = useState<DeploymentInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(false)

  // Show info toast on component mount
  useEffect(() => {
    toast.info('Important Information', {
      description: 'All changes in this project are saved to GitHub. However, data loading occurs from the file system. This file system is updated only after a Vercel build. If you don\'t see your latest updates after refreshing the page, it\'s time to trigger a build. After successful build completion, all your recent changes will be visible in the application.',
      duration: 8000,
    })
  }, [])

  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      toast.error('Deployment Error', {
        description: error,
        duration: 5000,
      })
    }
  }, [error])

  // Polling function to check deployment status
  const pollDeploymentStatus = async (deploymentId: string) => {
    try {
      const response = await fetch(`/api/vercel/deploy?deploymentId=${deploymentId}`)
      
      if (!response.ok) {
        throw new Error('Failed to check deployment status')
      }

      const data = await response.json()
      
      if (data.isComplete) {
        setIsPolling(false)
        if (data.status === 'READY') {
          setDeploymentStatus('success')
          toast.success('Deployment Completed Successfully!', {
            description: 'The application has been successfully deployed and is available at the URL.',
            duration: 5000,
          })
        } else {
          setDeploymentStatus('error')
          const errorMsg = `Deployment failed with status: ${data.status}`
          setError(errorMsg)
        }
      }
    } catch (err) {
      const errorMsg = 'Failed to check deployment status'
      setError(errorMsg)
      setIsPolling(false)
      setDeploymentStatus('error')
    }
  }

  // Effect for polling deployment status every 5 seconds
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isPolling && deploymentInfo?.deploymentId) {
      intervalId = setInterval(() => {
        pollDeploymentStatus(deploymentInfo.deploymentId)
      }, 5000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isPolling, deploymentInfo?.deploymentId])

  // Trigger new deployment
  const handleDeploy = async () => {
    try {
      setDeploymentStatus('building')
      setError(null)
      setDeploymentInfo(null)

      toast.loading('Starting Deployment...', {
        description: 'Initializing the application build process.',
        id: 'deploy-loading'
      })

      const response = await fetch('/api/vercel/deploy', {
        method: 'POST',
      })

      toast.dismiss('deploy-loading')

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to trigger deployment')
      }

      const data = await response.json()
      setDeploymentInfo(data)
      setIsPolling(true)

      toast.success('Deployment Started!', {
        description: 'Build process has begun. Please wait for completion...',
        duration: 3000,
      })

    } catch (err) {
      toast.dismiss('deploy-loading')
      const errorMsg = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMsg)
      setDeploymentStatus('error')
    }
  }

  // Reset deployment state
  const resetDeployment = () => {
    setDeploymentStatus('idle')
    setDeploymentInfo(null)
    setError(null)
    setIsPolling(false)
    
    toast.info('State Reset', {
      description: 'Ready for new deployment launch.',
      duration: 2000,
    })
  }

  // Get status indicator
  const getStatusIndicator = () => {
    switch (deploymentStatus) {
      case 'building':
        return <Loader2 className="h-4 w-4 text-orange-500 animate-spin" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Play className="h-4 w-4" />
    }
  }

  // Get status text
  const getStatusText = () => {
    switch (deploymentStatus) {
      case 'building':
        return 'Build in progress...'
      case 'success':
        return 'Build completed successfully'
      case 'error':
        return 'Build failed'
      default:
        return 'Ready to deploy'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Vercel Deployment Management</h1>
        <p className="text-muted-foreground">
          Manual application build and deployment control
        </p>
      </div>

      {/* Information Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-primary/20 dark:primary/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 ">
            <Info className="h-5 w-5 text-primary/80" />
            How This System Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className=" eading-relaxed">
              This project uses a hybrid data management approach for optimal performance and reliability:
            </p>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-primary/10 dark:border-primary/90">
                <GitBranch className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm">
                    Data Storage
                  </h4>
                  <p className="text-green-800 dark:text-green-200 text-xs">
                    All changes are automatically saved to GitHub repository for version control
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-primary/10 dark:border-primary/90">
                <Database className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100 text-sm">
                    Data Loading
                  </h4>
                  <p className="text-orange-800 dark:text-orange-200 text-xs">
                    Application loads data from optimized file system for faster performance
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-primary/10 dark:border-primary/90">
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 text-sm">
                    Synchronization
                  </h4>
                  <p className="text-purple-800 dark:text-purple-200 text-xs">
                    File system updates only after Vercel build completes
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-medium text-amber-900 dark:text-amber-100 text-sm mb-1">
                    Important Note
                  </h5>
                  <p className="text-amber-800 dark:text-amber-200 text-xs">
                    If you don't see your latest changes after refreshing the page, trigger a new build. 
                    After successful build completion, all your recent updates will be visible in the application.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIndicator()}
            Deployment Status
          </CardTitle>
          <CardDescription>
            {getStatusText()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {deploymentInfo && (
            <div className="space-y-2">
              <p><strong>Deployment ID:</strong> {deploymentInfo.deploymentId}</p>
              <p><strong>Status:</strong> {deploymentInfo.status}</p>
              {deploymentInfo.url && (
                <p>
                  <strong>URL:</strong>{' '}
                  <a 
                    href={deploymentInfo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary/60 over:underline"
                  >
                    {deploymentInfo.url}
                  </a>
                </p>
              )}
              <p>
                <strong>Created:</strong>{' '}
                {new Date(deploymentInfo.createdAt).toLocaleString('en-US')}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleDeploy}
              disabled={deploymentStatus === 'building'}
              className="flex items-center gap-2"
            >
              {deploymentStatus === 'building' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {deploymentStatus === 'building' ? 'Deploying...' : 'Start Deployment'}
            </Button>

            {deploymentStatus !== 'idle' && (
              <Button
                onClick={resetDeployment}
                variant="outline"
              >
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
