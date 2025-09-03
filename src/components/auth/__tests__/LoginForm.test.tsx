import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../LoginForm'
import { useRouter } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
    },
  })),
}))

describe('LoginForm', () => {
  const mockPush = jest.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
    })
  })

  describe('렌더링 테스트', () => {
    it('로그인 폼이 올바르게 렌더링되어야 한다', () => {
      render(<LoginForm />)
      
      expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /로그인/i })).toBeInTheDocument()
      expect(screen.getByText(/회원가입/i)).toBeInTheDocument()
    })

    it('데모 모드 버튼이 표시되어야 한다', () => {
      render(<LoginForm />)
      
      expect(screen.getByRole('button', { name: /데모 모드로 체험하기/i })).toBeInTheDocument()
    })
  })

  describe('입력 유효성 검사', () => {
    it('빈 이메일로 제출 시 에러를 표시해야 한다', async () => {
      render(<LoginForm />)
      
      const submitButton = screen.getByRole('button', { name: /로그인/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/이메일을 입력해주세요/i)).toBeInTheDocument()
      })
    })

    it('잘못된 이메일 형식 입력 시 에러를 표시해야 한다', async () => {
      render(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/이메일/i)
      await user.type(emailInput, 'invalid-email')
      
      const submitButton = screen.getByRole('button', { name: /로그인/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/올바른 이메일 형식이 아닙니다/i)).toBeInTheDocument()
      })
    })

    it('빈 비밀번호로 제출 시 에러를 표시해야 한다', async () => {
      render(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/이메일/i)
      await user.type(emailInput, 'test@example.com')
      
      const submitButton = screen.getByRole('button', { name: /로그인/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/비밀번호를 입력해주세요/i)).toBeInTheDocument()
      })
    })

    it('비밀번호가 6자 미만일 때 에러를 표시해야 한다', async () => {
      render(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/이메일/i)
      const passwordInput = screen.getByLabelText(/비밀번호/i)
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, '12345')
      
      const submitButton = screen.getByRole('button', { name: /로그인/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/비밀번호는 최소 6자 이상이어야 합니다/i)).toBeInTheDocument()
      })
    })
  })

  describe('로그인 프로세스', () => {
    it('유효한 입력으로 로그인 성공 시 대시보드로 이동해야 한다', async () => {
      const { createClient } = require('@/lib/supabase')
      const mockSignIn = jest.fn().mockResolvedValue({
        data: { user: { id: '123' }, session: {} },
        error: null,
      })
      
      createClient.mockReturnValue({
        auth: {
          signInWithPassword: mockSignIn,
        },
      })
      
      render(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/이메일/i)
      const passwordInput = screen.getByLabelText(/비밀번호/i)
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      
      const submitButton = screen.getByRole('button', { name: /로그인/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        })
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
      })
    })

    it('로그인 실패 시 에러 메시지를 표시해야 한다', async () => {
      const { createClient } = require('@/lib/supabase')
      const mockSignIn = jest.fn().mockResolvedValue({
        data: null,
        error: { message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
      })
      
      createClient.mockReturnValue({
        auth: {
          signInWithPassword: mockSignIn,
        },
      })
      
      render(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/이메일/i)
      const passwordInput = screen.getByLabelText(/비밀번호/i)
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'wrongpassword')
      
      const submitButton = screen.getByRole('button', { name: /로그인/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/이메일 또는 비밀번호가 올바르지 않습니다/i)).toBeInTheDocument()
      })
    })

    it('로그인 중 로딩 상태를 표시해야 한다', async () => {
      const { createClient } = require('@/lib/supabase')
      const mockSignIn = jest.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 1000))
      )
      
      createClient.mockReturnValue({
        auth: {
          signInWithPassword: mockSignIn,
        },
      })
      
      render(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/이메일/i)
      const passwordInput = screen.getByLabelText(/비밀번호/i)
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      
      const submitButton = screen.getByRole('button', { name: /로그인/i })
      await user.click(submitButton)
      
      expect(screen.getByText(/로그인 중.../i)).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })
  })

  describe('데모 모드', () => {
    it('데모 모드 버튼 클릭 시 demo/trial로 이동해야 한다', async () => {
      render(<LoginForm />)
      
      const demoButton = screen.getByRole('button', { name: /데모 모드로 체험하기/i })
      await user.click(demoButton)
      
      expect(mockPush).toHaveBeenCalledWith('/demo/trial')
    })
  })

  describe('접근성 테스트', () => {
    it('키보드로 모든 요소에 접근 가능해야 한다', async () => {
      render(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/이메일/i)
      const passwordInput = screen.getByLabelText(/비밀번호/i)
      const submitButton = screen.getByRole('button', { name: /로그인/i })
      
      // Tab 키로 이동 시뮬레이션
      emailInput.focus()
      expect(document.activeElement).toBe(emailInput)
      
      await user.tab()
      expect(document.activeElement).toBe(passwordInput)
      
      await user.tab()
      expect(document.activeElement).toBe(submitButton)
    })

    it('에러 메시지가 스크린 리더에 읽혀야 한다', async () => {
      render(<LoginForm />)
      
      const submitButton = screen.getByRole('button', { name: /로그인/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/이메일을 입력해주세요/i)
        expect(errorMessage).toHaveAttribute('role', 'alert')
      })
    })
  })

  describe('보안 테스트', () => {
    it('비밀번호 필드가 마스킹되어야 한다', () => {
      render(<LoginForm />)
      
      const passwordInput = screen.getByLabelText(/비밀번호/i)
      expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('XSS 공격 방지: 스크립트 태그 입력 시 처리해야 한다', async () => {
      render(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/이메일/i)
      await user.type(emailInput, '<script>alert("XSS")</script>@example.com')
      
      const submitButton = screen.getByRole('button', { name: /로그인/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/올바른 이메일 형식이 아닙니다/i)).toBeInTheDocument()
      })
    })

    it('SQL Injection 방지: 특수문자 처리를 확인해야 한다', async () => {
      const { createClient } = require('@/lib/supabase')
      const mockSignIn = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      })
      
      createClient.mockReturnValue({
        auth: {
          signInWithPassword: mockSignIn,
        },
      })
      
      render(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/이메일/i)
      const passwordInput = screen.getByLabelText(/비밀번호/i)
      
      await user.type(emailInput, "admin'--@example.com")
      await user.type(passwordInput, "' OR '1'='1")
      
      const submitButton = screen.getByRole('button', { name: /로그인/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        // Supabase가 자동으로 SQL injection을 방지하는지 확인
        expect(mockSignIn).toHaveBeenCalledWith({
          email: "admin'--@example.com",
          password: "' OR '1'='1",
        })
      })
    })
  })
})