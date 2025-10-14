import { Heart, MessageCircle, Share2, MoreHorizontal, Award, Plus, Image, Smile } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function SocialPage() {
  const { user } = useAuth();
  const { state, createPost, likePost } = useApp();
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = ['Para você', 'Seguindo', 'Análises', 'Perguntas', 'Construtoras'];

  const handleCreatePost = async () => {
    if (newPostContent.trim() && user) {
      setIsSubmitting(true);
      await createPost({
        content: newPostContent.trim(),
        images: [],
        post_type: 'general',
      });
      setNewPostContent('');
      setShowNewPost(false);
      setIsSubmitting(false);
    }
  };

  const handleLikePost = (postId: string) => {
    likePost(postId);
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'analysis': return '📊';
      case 'announcement': return '📢';
      case 'question': return '❓';
      default: return '💭';
    }
  };

  const mockUsers = [
    { id: 'user-1', name: 'Carlos Mendes', username: '@carlosmendes', avatar: 'CM', badge: 'Investidor Expert', color: 'from-blue-500 to-purple-600' },
    { id: 'user-2', name: 'Marina Silva', username: '@marinasilva', avatar: 'MS', badge: 'Construtor Certificado', color: 'from-green-500 to-teal-600' },
  ];

  const getUserForPost = (postUserId: string) => {
    return mockUsers.find(u => u.id === postUserId) || {
      id: postUserId,
      name: 'Usuário Anônimo',
      username: '@anonymous',
      avatar: 'A',
      badge: 'Investidor',
      color: 'from-gray-500 to-gray-700'
    };
  };

  return (
    <div className="pb-20 pt-16 px-4 space-y-4">
      <div className="binance-card p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FCD535] to-orange-500 rounded-full flex items-center justify-center text-lg font-bold">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="flex-1 binance-input text-left text-gray-400 hover:text-white transition-colors"
          >
            Compartilhe suas ideias...
          </button>
          <button
            onClick={() => setShowNewPost(true)}
            className="binance-btn-primary px-4 py-2"
          >
            Postar
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(i)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
              i === selectedTab
                ? 'bg-[#FCD535] text-black'
                : 'bg-[#2B3139] text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {state.posts.map((post) => {
          const postUser = getUserForPost(post.user_id);
          const isLiked = likedPosts.has(post.id);
          
          return (
            <div key={post.id} className="binance-card p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${postUser.color} rounded-full flex items-center justify-center font-bold`}>
                  {postUser.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{postUser.name}</span>
                    <span className="px-2 py-0.5 bg-[#FCD535]/20 text-[#FCD535] text-xs rounded flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {postUser.badge}
                    </span>
                    <span className="text-lg">{getPostTypeIcon(post.post_type)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{postUser.username}</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <p className="mb-3 text-sm leading-relaxed">{post.content}</p>

              {post.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {post.images.map((image, index) => (
                    <img key={index} src={image} alt="Post" className="w-full h-32 object-cover rounded-lg" />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-6 pt-3 border-t border-gray-800">
                <button 
                  onClick={() => handleLikePost(post.id)}
                  className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-[#F6465D]' : 'text-gray-400 hover:text-[#F6465D]'}`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{post.likes_count}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-[#FCD535] transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.comments_count}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-[#02C076] transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.shares_count}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="binance-card p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Novo Post</h3>
              <button onClick={() => setShowNewPost(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="binance-input w-full h-24 resize-none"
                  placeholder="Compartilhe suas ideias..."
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-[#FCD535] transition-colors"><Image className="w-5 h-5" /></button>
                    <button className="p-2 text-gray-400 hover:text-[#FCD535] transition-colors"><Smile className="w-5 h-5" /></button>
                  </div>
                  <span className="text-xs text-gray-400">{newPostContent.length}/500</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowNewPost(false)} className="flex-1 py-2 bg-[#2B3139] hover:bg-gray-600 text-white rounded transition-colors">Cancelar</button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim() || isSubmitting}
                  className="flex-1 binance-btn-primary py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Postando...' : 'Postar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setShowNewPost(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-[#FCD535] hover:bg-[#F0B90B] rounded-full flex items-center justify-center shadow-lg transition-colors z-30"
      >
        <Plus className="w-6 h-6 text-black" />
      </button>
    </div>
  );
}