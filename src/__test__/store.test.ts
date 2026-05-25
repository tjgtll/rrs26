import { renderHook, act } from '@testing-library/react';
import { useSelectedStore } from '../store/store';
import { describe, it, expect } from 'vitest';

describe('useSelectedStore', () => {
  it('add and remove', () => {
    const { result } = renderHook(() => useSelectedStore());
    act(() => result.current.toggleSelect('pikachu'));
    expect(result.current.selected.has('pikachu')).toBe(true);
    act(() => result.current.toggleSelect('pikachu'));
    expect(result.current.selected.has('pikachu')).toBe(false);
  });

  it('unselectAll', () => {
    const { result } = renderHook(() => useSelectedStore());
    act(() => {
      result.current.toggleSelect('bulbasaur');
      result.current.toggleSelect('charmander');
    });
    expect(result.current.selected.size).toBe(2);
    act(() => result.current.unselectAll());
    expect(result.current.selected.size).toBe(0);
  });
});